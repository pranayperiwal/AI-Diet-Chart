import React from "react";

export default function DietTable({ tableData }) {
  const ThData = () => {
    return tableData.map((meal) => {
      return <th key={meal.mealName}>{meal.mealName}</th>;
    });
  };

  const caloriesProtein = () => {
    return tableData.map((meal) => {
      if (meal.protein) {
        return <td>{meal.calories + ", " + meal.protein}</td>;
      } else {
        return <td>{meal.calories}</td>;
      }
    });
  };

  const mealPrompt = () => {
    return tableData.map((meal) => {
      return <td>{meal.mealPromptOutput}</td>;
    });
  };

  return (
    <div className="diet-table-container">
      <table className="diet-table">
        <thead>
          <tr>{ThData()}</tr>
        </thead>
        <tbody>
          <tr className="diet-table-calories-protein">{caloriesProtein()}</tr>
          <tr>{mealPrompt()}</tr>
        </tbody>
      </table>
    </div>
  );
}
