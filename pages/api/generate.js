import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createFirstPrompt = (meals, calories, protein) => {
  return (
    "I would like to consume " +
    meals +
    " meals in the day. List how many calories I should consume in every meal. I would like to consume " +
    calories +
    " calories and " +
    protein +
    " gm of protein. The calories and protein should not be equal in every meal. Make breakfast my heaviest meal."
  );
};
const generateAction = async (req, res) => {
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: createFirstPrompt(
      req.body.mealCount,
      req.body.calories,
      req.body.protein
    ),
    temperature: 0.8,
    max_tokens: 1250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  const meals = basePromptOutput.text.split("\n").filter((val) => val !== "");

  const mealObjects = await Promise.all(
    meals.map(async (meal) => {
      const mealName = meal.split(":")[0];
      const mealCalProtein = meal.split(": ")[1];
      const calories = mealCalProtein.split(", ")[0];
      const protein = mealCalProtein.split(", ")[1];

      const dietRquirements =
        req.body.dietRestriction == "non-vegetarian"
          ? ""
          : req.body.dietRestriction;

      let mealSpecificPrompt = "";
      if (protein) {
        mealSpecificPrompt =
          "Prepare a " +
          dietRquirements +
          " " +
          mealName +
          " meal with " +
          calories +
          " and " +
          protein;
      } else {
        mealSpecificPrompt =
          "Prepare a " +
          dietRquirements +
          " " +
          mealName +
          " meal with " +
          calories;
      }

      const mealCompletion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: mealSpecificPrompt,
        temperature: 0.7,
        max_tokens: 1250,
      });

      const mealPromptOutput = mealCompletion.data.choices.pop();

      let newMealPrompt = mealPromptOutput.text.split("\n");

      let i = 0;
      while (true) {
        if (newMealPrompt[i] == "") {
          i += 1;
        } else {
          newMealPrompt = newMealPrompt.slice(i);
          break;
        }
      }

      newMealPrompt = newMealPrompt.join("\n");

      return {
        mealName,
        calories,
        protein,
        mealPromptOutput: newMealPrompt,
      };
    })
  );

  // console.log(mealObjects);

  res
    .status(200)
    .json({ baseMealOutput: basePromptOutput, allMeals: mealObjects });
};

export default generateAction;
