import Head from "next/head";
import NumberInput from "../components/NumberInput";
import DietTable from "../components/DietTable";
import GenerateButton from "../components/GenerateButton";
import { useState } from "react";

const Home = () => {
  const [dietTable, setDietTable] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [dietRadio, setDietRadio] = useState("non-vegetarian");
  const [mealCount, setMealCount] = useState(4);
  const [calories, setCalories] = useState(2000);
  const [protein, setProtein] = useState(100);

  const changeDietRadio = (e) => {
    setDietRadio(e.target.value);
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mealCount,
        calories,
        protein,
        dietRestriction: dietRadio,
      }),
    });

    const data = await response.json();
    const { baseMealOutput, allMeals } = data;
    console.log();
    console.log("OpenAI replied...", baseMealOutput.text);

    // setApiOutput(`${baseMealOutput.text}`);
    setDietTable(allMeals);

    setIsGenerating(false);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Diet Chart</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Let's build your Diet Chart</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Use the following inputs to fine tune your dietary requirements
            </h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <div className="prompt-input">
          <NumberInput
            placeholderInput="4"
            title="number of meals"
            stateVar={mealCount}
            userInput={setMealCount}
          />

          <NumberInput
            placeholderInput="2000"
            title="target calories"
            stateVar={calories}
            userInput={setCalories}
          />

          <NumberInput
            placeholderInput="100"
            title="target protein"
            stateVar={protein}
            userInput={setProtein}
          />
        </div>
        <form className="radio-buttons">
          <div className="diet-radio">
            <input
              type="radio"
              value="non-vegetarian"
              name="nonveg"
              checked={dietRadio == "non-vegetarian"}
              onChange={changeDietRadio}
            />
            non-vegetarian
          </div>

          <div className="diet-radio">
            <input
              type="radio"
              value="vegetarian"
              name="veg"
              checked={dietRadio == "vegetarian"}
              onChange={changeDietRadio}
            />
            vegetarian
          </div>
        </form>
        <GenerateButton
          isGenerating={isGenerating}
          callGenerateEndpoint={callGenerateEndpoint}
        />
      </div>

      {isGenerating && (
        <div className="header">
          <p>GPT-3 is figuring out how to maximize your gains...</p>
        </div>
      )}

      {dietTable && (
        <div className="output">
          <DietTable tableData={dietTable} />
        </div>
      )}
    </div>
  );
};

export default Home;
