const KPICard = ({ title, value }) => (
  <div className="kpi-card">
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

export default KPICard;
