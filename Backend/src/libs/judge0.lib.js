import axios from "axios";

const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    CPP: 54
  };

  return languageMap[language.toUpperCase()];
};

const submitBatch = async (submissions) => {
  const url = `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`;
  const { data } = await axios.post(url, { submissions });

  return data;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pollBatchResults = async (tokens) => {
  while (true) {
    const url = `${process.env.JUDGE0_API_URL}/submissions/batch`;
    const { data } = await axios.get(url, {
      params: {
        tokens: tokens.join(","),
        base64_encoded: false,
      },
    });

    const results = data.submissions;

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2,
    );
    
    if (isAllDone) return results;
    await sleep(1000);
  }
};

const getLanguageName = (language_id) => {
  const LANGUAGE_NAMES = {
    62: "Java",
    63: "JavaScript",
    71: "Python",
    54: "CPP"
  };

  return LANGUAGE_NAMES[language_id] || "Unknown";
};

export { getJudge0LanguageId, submitBatch, pollBatchResults, getLanguageName };
