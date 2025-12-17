import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  colorClass,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${colorClass} rounded-lg p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline justify-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
