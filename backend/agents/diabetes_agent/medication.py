import json
from pathlib import Path

from models.schemas import MedicationRecommendation
from utils.config import settings


class MedicationRecommendationEngine:
    def __init__(self, knowledge_path: Path = settings.data_dir / "medication_kb.json") -> None:
        self.knowledge_path = knowledge_path

    def _fetch_brands(self, generic_name: str, limit: int = 5) -> list[dict]:
        import re
        from services.database import get_connection
        
        # Identified diabetic compounds to look up in the AZ dataset
        compounds = [
            "Metformin", "Insulin", "Glimepiride", "Gliclazide", 
            "Sitagliptin", "Vildagliptin", "Teneligliptin", 
            "Dapagliflozin", "Empagliflozin", "Pioglitazone"
        ]
        search_terms = [c for c in compounds if re.search(r"\b" + re.escape(c) + r"\b", generic_name, re.IGNORECASE)]
        
        if not search_terms:
            if "metformin" in generic_name.lower():
                search_terms.append("Metformin")
            elif "insulin" in generic_name.lower():
                search_terms.append("Insulin")
                
        if not search_terms:
            return []
            
        brands = []
        try:
            with get_connection() as conn:
                for term in search_terms:
                    cursor = conn.cursor()
                    cursor.execute(
                        """
                        SELECT name, price, manufacturer_name, pack_size_label, short_composition1, short_composition2
                        FROM medicines
                        WHERE (short_composition1 LIKE ? OR short_composition2 LIKE ?)
                          AND is_discontinued = 0
                        LIMIT ?
                        """,
                        (f"%{term}%", f"%{term}%", limit)
                    )
                    rows = cursor.fetchall()
                    for row in rows:
                        comp = row["short_composition1"] or ""
                        if row["short_composition2"]:
                            comp += f" + {row['short_composition2']}"
                        brands.append({
                            "name": row["name"],
                            "manufacturer": row["manufacturer_name"] or "Unknown",
                            "price": row["price"] if row["price"] is not None else 0.0,
                            "pack_size": row["pack_size_label"] or "N/A",
                            "composition": comp.strip()
                        })
        except Exception as exc:
            # Prevent failures if table doesn't exist during initial migrations or testing
            print(f"Error fetching brands for {generic_name}: {exc}")
            
        return brands

    def recommend(self, diagnosis: str, severity: str = "moderate") -> list[MedicationRecommendation]:
        from agents.diabetes_agent.alternative import AlternativeMedicineEngine
        
        data = json.loads(self.knowledge_path.read_text(encoding="utf-8"))
        key = "Severe" if severity == "severe" else diagnosis
        recommendations = data.get(key, data.get("Prediabetes", []))
        
        alt_engine = AlternativeMedicineEngine()
        all_herbs, _ = alt_engine.recommend(limit=5)
        
        results = []
        for item in recommendations:
            rec = MedicationRecommendation(**item)
            rec.brands = self._fetch_brands(rec.medication)
            
            med_lower = rec.medication.lower()
            rec_herbs = []
            if "metformin" in med_lower:
                rec_herbs = [h for h in all_herbs if h.name.lower() in ["bitter gourd", "amla"]]
            elif "insulin" in med_lower:
                rec_herbs = [h for h in all_herbs if h.name.lower() in ["fenugreek"]]
            elif "lifestyle" in med_lower or "no diabetes medication" in med_lower:
                rec_herbs = [h for h in all_herbs if h.name.lower() in ["fenugreek", "bitter gourd"]]
            else:
                rec_herbs = all_herbs
                
            rec.alternatives = rec_herbs
            results.append(rec)
        return results
