import { editSettings, getSettings } from "fe/services";

export const getSettingsHelper = ({ successFn, errorFn, endFn }) => {
  getSettings()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const editSettingsHelper = ({
  successFn,
  errorFn,
  endFn,
  settingsData
}) => {
  editSettings(settingsData)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
