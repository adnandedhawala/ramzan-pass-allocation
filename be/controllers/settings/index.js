import { settingsSchema } from "be/validators/settings";
import { Settings } from "models";

export const getSettingsController = async (_request, response) => {
  try {
    const data = await Settings.find({
      _id: process.env.NEXT_PUBLIC_SETTINGS_KEY
    });
    return response.status(200).send({ data });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const editSettingsController = async (request, response) => {
  const { data } = request.body;
  if (!data) return response.status(400).end("data is missing!");
  settingsSchema
    .validate(data)
    .then(async editObject => {
      const { _id, ...details } = editObject;
      const result = await Settings.findByIdAndUpdate(_id, { ...details });
      if (result) {
        response.status(200).send("Settings are updated!");
      } else {
        response.status(400).send("Incorrect Settings Id");
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};
