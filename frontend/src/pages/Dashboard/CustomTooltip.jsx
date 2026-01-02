export const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, value } = payload[0].payload;

  return (
    <div className="bg-white rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-gray-600">
        Alerts: <span className="font-medium">{value}</span>
      </p>
    </div>
  );
};
