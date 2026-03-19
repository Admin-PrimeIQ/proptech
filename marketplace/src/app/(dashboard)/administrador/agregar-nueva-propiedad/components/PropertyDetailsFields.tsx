"use client";

interface PropertyDetailsFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function PropertyDetailsFields({ formData, setFormData }: PropertyDetailsFieldsProps) {
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="tp-dashboard-new-property mb-50">
      <h5 className="tp-dashboard-new-title">Detalles de la Propiedad</h5>
      <div className="row">
        <div className="col-lg-4">
          <div className="tp-dashboard-new-input">
            <label>Habitaciones:*</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.habitaciones || ""}
              onChange={(e) => handleInputChange("habitaciones", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="tp-dashboard-new-input">
            <label>Baños:*</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.banos || ""}
              onChange={(e) => handleInputChange("banos", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="tp-dashboard-new-input">
            <label>Parqueos:*</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.parqueos || ""}
              onChange={(e) => handleInputChange("parqueos", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="tp-dashboard-new-input">
            <label>Metros Construcción (m²):*</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.metro_construccion || ""}
              onChange={(e) => handleInputChange("metro_construccion", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="tp-dashboard-new-input">
            <label>Metros Terreno (m²):*</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.metros_terreno || ""}
              onChange={(e) => handleInputChange("metros_terreno", e.target.value)}
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="tp-dashboard-new-input">
            <label>Año Construcción:*</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              placeholder="2024"
              value={formData.ano_construccion || ""}
              onChange={(e) => handleInputChange("ano_construccion", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
