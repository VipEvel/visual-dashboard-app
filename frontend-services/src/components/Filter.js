import React, { useState } from "react";

function DashboardFilters({ data, onFilterChange }) {
  const [filters, setFilters] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
  });

  const handleChange = (filterKey, value) => {
    let tempFilters = {
      ...filters,
      [filterKey]: filterKey === "end_year" ? parseInt(value) || '' : value,
    };

    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: filterKey === "end_year" ? parseInt(value) ||'' : value,
    }));
    // Call the callback function to notify the parent component of filter changes
    if (onFilterChange) {
      onFilterChange(tempFilters);
    }
  };

  // Define an array of filter criteria
  const filterCriteria = [
    { key: "end_year", label: "End Year" },
    { key: "topic", label: "Topics" },
    { key: "sector", label: "Sector" },
    { key: "region", label: "Region" },
    { key: "pestle", label: "PEST" },
    { key: "source", label: "Source" },
    { key: "country", label: "Country" },
  ];

  return (
    <div className="flex gap-4 flex-wrap">
      {filterCriteria.map(({ key, label, multiple }) => (
        <div className="w-[13.5%] min-w-56">
          <div className="flex gap-4 flex-col" key={key}>
            <label className="whitespace-nowrap" htmlFor={key}>
              {label}:
            </label>
            {multiple ? (
              <select
                id={key}
                className="border w-3/5"
                value={filters[key]}
                onChange={(e) =>
                  handleChange(
                    key,
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                multiple
              >
                <option className="capitalize" value="">
                  Select {label}
                </option>
                {/* Map over unique values of the filter criteria and render option for each */}
                {[...new Set(data.map((item) => item[key]))].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ) : (
              <select
                id={key}
                className="border"
                value={filters[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              >
                <option className="capitalize" value="">
                  Select {label}
                </option>
                {/* Map over unique values of the filter criteria and render option for each */}
                {[...new Set(data.map((item) => item[key]))]
                  .filter(Boolean)
                  .sort((a, b) =>
                    typeof a === "number" && typeof b === "number"
                      ? a - b
                      : a
                          .toString()
                          .toLowerCase()
                          ?.localeCompare(b?.toString()?.toLowerCase())
                  )
                  .map((value) => (
                    <option className="capitalize" key={value} value={value}>
                      {value}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardFilters;
