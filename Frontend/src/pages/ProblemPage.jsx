import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const { submitCode, executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      submitCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleExecuteCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/70 text-lg font-sem">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl w-full">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="mt-2">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex-none gap-4">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className="select select-bordered select-primary w-40"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang == "CPP" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button
                  className={`tab gap-2 ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "discussion" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "hints" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </button>
              </div>

              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button className="tab tab-active gap-2">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[600px] w-full">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 20,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="p-4 border-t border-base-300 bg-base-200">
                <div className="flex justify-between items-center">
                  <button
                    className={`btn btn-primary gap-2 ${
                      isExecuting ? "loading" : ""
                    }`}
                    onClick={handleExecuteCode}
                    disabled={isExecuting}
                  >
                    {!isExecuting && <Play className="w-4 h-4" />}
                    Run Code
                  </button>
                  <button 
                    className="btn btn-success gap-2"
                    onClick={handleRunCode}
                    disabled={isExecuting}  
                  >Submit Solution
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            {submission ? (
              <Submission submission={submission} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Expected Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testCase, index) => (
                        <tr key={index}>
                          <td className="font-mono">{testCase.input}</td>
                          <td className="font-mono">{testCase.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;

// {
//   "title": "Minimum Window Substring",
//   "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return an empty string `\"\"`.",
//   "difficulty": "HARD",
//   "tags": ["hash-table", "string", "sliding-window"],
//   "examples": {
//     "PYTHON": {
//       "input": "ADOBECODEBANC\nABC",
//       "output": "BANC",
//       "explanation": "The minimum window substring is 'BANC' which contains all the characters of 'ABC'."
//     },
//     "JAVASCRIPT": {
//       "input": "a\nb",
//       "output": "",
//       "explanation": "There is no window in 'a' that contains 'b'."
//     },
//     "CPP": {
//       "input": "aa\naa",
//       "output": "aa",
//       "explanation": "The window is the entire string itself."
//     }
//   },
//   "constraints": "1 <= s.length, t.length <= 10^5\ns and t consist of uppercase and lowercase English letters.",
//   "testcases": [
//     { "input": "ADOBECODEBANC\nABC", "output": "BANC" },
//     { "input": "a\nb", "output": "" },
//     { "input": "aa\naa", "output": "aa" },
//     { "input": "aaflslflsldkabcabcaa\nabc", "output": "abc" },
//     { "input": "ab\nb", "output": "b" }
//   ],
//   "codeSnippets": {
//     "PYTHON": "import sys\ns, t = sys.stdin.read().strip().split('\\n')\nfrom collections import Counter\n\ndef min_window(s, t):\n    if not t or not s:\n        return \"\"\n    t_count = Counter(t)\n    window_count = {}\n    have, need = 0, len(t_count)\n    res, res_len = [-1, -1], float('inf')\n    l = 0\n    for r, c in enumerate(s):\n        window_count[c] = window_count.get(c, 0) + 1\n        if c in t_count and window_count[c] == t_count[c]:\n            have += 1\n        while have == need:\n            if (r - l + 1) < res_len:\n                res = [l, r]\n                res_len = r - l + 1\n            window_count[s[l]] -= 1\n            if s[l] in t_count and window_count[s[l]] < t_count[s[l]]:\n                have -= 1\n            l += 1\n    l, r = res\n    return s[l:r+1] if res_len != float('inf') else \"\"\n\nprint(min_window(s, t))",
//     "JAVASCRIPT": "const fs = require('fs');\nconst [s, t] = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n\nfunction minWindow(s, t) {\n    if (t === \"\" || s === \"\") return \"\";\n    const tCount = {};\n    for (let c of t) tCount[c] = (tCount[c] || 0) + 1;\n    let have = 0, need = Object.keys(tCount).length;\n    const window = {};\n    let res = [-1, -1], resLen = Infinity;\n    let l = 0;\n    for (let r = 0; r < s.length; r++) {\n        let c = s[r];\n        window[c] = (window[c] || 0) + 1;\n        if (c in tCount && window[c] === tCount[c]) have++;\n        while (have === need) {\n            if ((r - l + 1) < resLen) {\n                res = [l, r];\n                resLen = r - l + 1;\n            }\n            window[s[l]]--;\n            if (s[l] in tCount && window[s[l]] < tCount[s[l]]) have--;\n            l++;\n        }\n    }\n    const [start, end] = res;\n    return resLen === Infinity ? \"\" : s.slice(start, end + 1);\n}\n\nconsole.log(minWindow(s, t));",
//     "JAVA": "import java.util.*;\n\npublic class Main {\n    public static String minWindow(String s, String t) {\n        if (s.length() == 0 || t.length() == 0) return \"\";\n        Map<Character, Integer> tCount = new HashMap<>();\n        for (char c : t.toCharArray())\n            tCount.put(c, tCount.getOrDefault(c, 0) + 1);\n        Map<Character, Integer> window = new HashMap<>();\n        int have = 0, need = tCount.size();\n        int l = 0, resLen = Integer.MAX_VALUE, resL = 0;\n        for (int r = 0; r < s.length(); r++) {\n            char c = s.charAt(r);\n            window.put(c, window.getOrDefault(c, 0) + 1);\n            if (tCount.containsKey(c) && window.get(c).intValue() == tCount.get(c).intValue())\n                have++;\n            while (have == need) {\n                if ((r - l + 1) < resLen) {\n                    resL = l;\n                    resLen = r - l + 1;\n                }\n                char left = s.charAt(l);\n                window.put(left, window.get(left) - 1);\n                if (tCount.containsKey(left) && window.get(left).intValue() < tCount.get(left).intValue())\n                    have--;\n                l++;\n            }\n        }\n        return resLen == Integer.MAX_VALUE ? \"\" : s.substring(resL, resL + resLen);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        String t = sc.nextLine();\n        System.out.println(minWindow(s, t));\n    }\n}",
//     "CPP": "#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <climits>\nusing namespace std;\n\nstring minWindow(string s, string t) {\n    if (t.empty() || s.empty()) return \"\";\n    unordered_map<char, int> tCount, window;\n    for (char c : t) tCount[c]++;\n    int have = 0, need = tCount.size();\n    int resLen = INT_MAX, resL = 0;\n    int l = 0;\n    for (int r = 0; r < s.size(); ++r) {\n        window[s[r]]++;\n        if (tCount.count(s[r]) && window[s[r]] == tCount[s[r]])\n            have++;\n        while (have == need) {\n            if (r - l + 1 < resLen) {\n                resL = l;\n                resLen = r - l + 1;\n            }\n            window[s[l]]--;\n            if (tCount.count(s[l]) && window[s[l]] < tCount[s[l]])\n                have--;\n            l++;\n        }\n    }\n    return resLen == INT_MAX ? \"\" : s.substr(resL, resLen);\n}\n\nint main() {\n    string s, t;\n    getline(cin, s);\n    getline(cin, t);\n    cout << minWindow(s, t) << endl;\n    return 0;\n}"
//   },
//   "referenceSolutions": {
//     "PYTHON": "import sys\ns, t = sys.stdin.read().strip().split('\\n')\nfrom collections import Counter\n\ndef min_window(s, t):\n    if not t or not s:\n        return \"\"\n    t_count = Counter(t)\n    window_count = {}\n    have, need = 0, len(t_count)\n    res, res_len = [-1, -1], float('inf')\n    l = 0\n    for r, c in enumerate(s):\n        window_count[c] = window_count.get(c, 0) + 1\n        if c in t_count and window_count[c] == t_count[c]:\n            have += 1\n        while have == need:\n            if (r - l + 1) < res_len:\n                res = [l, r]\n                res_len = r - l + 1\n            window_count[s[l]] -= 1\n            if s[l] in t_count and window_count[s[l]] < t_count[s[l]]:\n                have -= 1\n            l += 1\n    l, r = res\n    return s[l:r+1] if res_len != float('inf') else \"\"\n\nprint(min_window(s, t))"
//   },
//   "hints": "Use a sliding window approach with two pointers. Expand the window until it contains all characters in t, then shrink it to find the minimum."
// }


// {
//   "title": "Longest Consecutive Sequence",
//   "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.",
//   "difficulty": "HARD",
//   "tags": ["array", "union-find", "hash-table"],
//   "examples": {
//     "PYTHON": {
//       "input": "100\n4\n200\n1\n3\n2",
//       "output": "4",
//       "explanation": "The longest consecutive sequence is [1, 2, 3, 4]. Length = 4."
//     },
//     "JAVASCRIPT": {
//       "input": "0\n3\n7\n2\n5\n8\n4\n6\n0\n1",
//       "output": "9",
//       "explanation": "The longest consecutive sequence is [0, 1, 2, 3, 4, 5, 6, 7, 8]. Length = 9."
//     },
//     "CPP": {
//       "input": "9\n1\n4\n7\n3\n2\n6\n0\n5\n8",
//       "output": "10",
//       "explanation": "All numbers from 0 to 9 form the sequence."
//     }
//   },
//   "constraints": "0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
//   "testcases": [
//     { "input": "100\n4\n200\n1\n3\n2", "output": "4" },
//     { "input": "0\n3\n7\n2\n5\n8\n4\n6\n0\n1", "output": "9" },
//     { "input": "9\n1\n4\n7\n3\n2\n6\n0\n5\n8", "output": "10" },
//     { "input": "1\n9\n3\n10\n2\n20", "output": "3" },
//     { "input": "", "output": "0" }
//   ],
//   "codeSnippets": {
//     "PYTHON": "import sys\nnums = list(map(int, sys.stdin.read().strip().split('\\n')))\n\ndef longest_consecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            current = num\n            streak = 1\n            while current + 1 in num_set:\n                current += 1\n                streak += 1\n            longest = max(longest, streak)\n    return longest\n\nprint(str(longest_consecutive(nums)))",
//     "JAVASCRIPT": "const fs = require('fs');\nconst nums = fs.readFileSync(0, 'utf-8').trim().split('\\n').map(Number);\n\nfunction longestConsecutive(nums) {\n    const set = new Set(nums);\n    let longest = 0;\n    for (let num of set) {\n        if (!set.has(num - 1)) {\n            let current = num;\n            let streak = 1;\n            while (set.has(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = Math.max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nconsole.log(longestConsecutive(nums));",
//     "JAVA": "import java.util.*;\n\npublic class Main {\n    public static int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int num : nums) set.add(num);\n        int longest = 0;\n        for (int num : set) {\n            if (!set.contains(num - 1)) {\n                int current = num;\n                int streak = 1;\n                while (set.contains(current + 1)) {\n                    current++;\n                    streak++;\n                }\n                longest = Math.max(longest, streak);\n            }\n        }\n        return longest;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextLine()) {\n            String line = sc.nextLine();\n            if (line.equals(\"\")) break;\n            nums.add(Integer.parseInt(line));\n        }\n        int[] arr = nums.stream().mapToInt(i -> i).toArray();\n        System.out.println(longestConsecutive(arr));\n    }\n}",
//     "CPP": "#include <iostream>\n#include <unordered_set>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint longestConsecutive(vector<int>& nums) {\n    unordered_set<int> num_set(nums.begin(), nums.end());\n    int longest = 0;\n    for (int num : num_set) {\n        if (!num_set.count(num - 1)) {\n            int current = num;\n            int streak = 1;\n            while (num_set.count(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nint main() {\n    string line;\n    vector<int> nums;\n    while (getline(cin, line) && !line.empty()) {\n        nums.push_back(stoi(line));\n    }\n    cout << longestConsecutive(nums) << endl;\n    return 0;\n}"
//   },
//   "referenceSolutions": {
//     "PYTHON": "import sys\nnums = list(map(int, sys.stdin.read().strip().split('\\n')))\n\ndef longest_consecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            current = num\n            streak = 1\n            while current + 1 in num_set:\n                current += 1\n                streak += 1\n            longest = max(longest, streak)\n    return longest\n\nprint(str(longest_consecutive(nums)))",
//     "JAVASCRIPT": "const fs = require('fs');\nconst nums = fs.readFileSync(0, 'utf-8').trim().split('\\n').map(Number);\n\nfunction longestConsecutive(nums) {\n    const set = new Set(nums);\n    let longest = 0;\n    for (let num of set) {\n        if (!set.has(num - 1)) {\n            let current = num;\n            let streak = 1;\n            while (set.has(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = Math.max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nconsole.log(longestConsecutive(nums));",
//     "JAVA": "import java.util.*;\n\npublic class Main {\n    public static int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int num : nums) set.add(num);\n        int longest = 0;\n        for (int num : set) {\n            if (!set.contains(num - 1)) {\n                int current = num;\n                int streak = 1;\n                while (set.contains(current + 1)) {\n                    current++;\n                    streak++;\n                }\n                longest = Math.max(longest, streak);\n            }\n        }\n        return longest;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextLine()) {\n            String line = sc.nextLine();\n            if (line.equals(\"\")) break;\n            nums.add(Integer.parseInt(line));\n        }\n        int[] arr = nums.stream().mapToInt(i -> i).toArray();\n        System.out.println(longestConsecutive(arr));\n    }\n}",
//     "CPP": "#include <iostream>\n#include <unordered_set>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint longestConsecutive(vector<int>& nums) {\n    unordered_set<int> num_set(nums.begin(), nums.end());\n    int longest = 0;\n    for (int num : num_set) {\n        if (!num_set.count(num - 1)) {\n            int current = num;\n            int streak = 1;\n            while (num_set.count(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nint main() {\n    string line;\n    vector<int> nums;\n    while (getline(cin, line) && !line.empty()) {\n        nums.push_back(stoi(line));\n    }\n    cout << longestConsecutive(nums) << endl;\n    return 0;\n}"
//   },
//   "hints": "Put all numbers into a set for O(1) lookups. Only start counting when the previous number doesn't exist."
// }

// {
//   "title": "Longest Consecutive Sequence",
//   "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in O(n) time.",
//   "difficulty": "HARD",
//   "tags": ["array", "union-find", "hash-table"],
//   "examples": {
//     "PYTHON": {
//       "input": "100\n4\n200\n1\n3\n2",
//       "output": "4",
//       "explanation": "The longest consecutive sequence is [1, 2, 3, 4]. Length = 4."
//     },
//     "JAVASCRIPT": {
//       "input": "0\n3\n7\n2\n5\n8\n4\n6\n0\n1",
//       "output": "9",
//       "explanation": "The longest consecutive sequence is [0, 1, 2, 3, 4, 5, 6, 7, 8]. Length = 9."
//     },
//     "CPP": {
//       "input": "9\n1\n4\n7\n3\n2\n6\n0\n5\n8",
//       "output": "10",
//       "explanation": "All numbers from 0 to 9 form the sequence."
//     }
//   },
//   "constraints": "0 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
//   "testcases": [
//     { "input": "100\n4\n200\n1\n3\n2", "output": "4" },
//     { "input": "0\n3\n7\n2\n5\n8\n4\n6\n0\n1", "output": "9" },
//     { "input": "9\n1\n4\n7\n3\n2\n6\n0\n5\n8", "output": "10" },
//     { "input": "1\n9\n3\n10\n2\n20", "output": "3" },
//     { "input": "", "output": "0" }
//   ],
//   "codeSnippets": {
//     "PYTHON": "import sys\nlines = sys.stdin.read().strip().split('\\n')\nnums = list(map(int, lines)) if lines[0] != '' else []\n\ndef longest_consecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            current = num\n            streak = 1\n            while current + 1 in num_set:\n                current += 1\n                streak += 1\n            longest = max(longest, streak)\n    return longest\n\nprint(str(longest_consecutive(nums)))",
//     "JAVASCRIPT": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst nums = input ? input.split('\\n').map(Number) : [];\n\nfunction longestConsecutive(nums) {\n    const set = new Set(nums);\n    let longest = 0;\n    for (let num of set) {\n        if (!set.has(num - 1)) {\n            let current = num;\n            let streak = 1;\n            while (set.has(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = Math.max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nconsole.log(longestConsecutive(nums));",
//     "JAVA": "import java.util.*;\n\npublic class Main {\n    public static int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int num : nums) set.add(num);\n        int longest = 0;\n        for (int num : set) {\n            if (!set.contains(num - 1)) {\n                int current = num;\n                int streak = 1;\n                while (set.contains(current + 1)) {\n                    current++;\n                    streak++;\n                }\n                longest = Math.max(longest, streak);\n            }\n        }\n        return longest;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextLine()) {\n            String line = sc.nextLine();\n            if (line.equals(\"\")) break;\n            nums.add(Integer.parseInt(line));\n        }\n        int[] arr = nums.stream().mapToInt(i -> i).toArray();\n        System.out.println(longestConsecutive(arr));\n    }\n}",
//     "CPP": "#include <iostream>\n#include <unordered_set>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint longestConsecutive(vector<int>& nums) {\n    unordered_set<int> num_set(nums.begin(), nums.end());\n    int longest = 0;\n    for (int num : num_set) {\n        if (!num_set.count(num - 1)) {\n            int current = num;\n            int streak = 1;\n            while (num_set.count(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nint main() {\n    string line;\n    vector<int> nums;\n    while (getline(cin, line) && !line.empty()) {\n        nums.push_back(stoi(line));\n    }\n    cout << longestConsecutive(nums) << endl;\n    return 0;\n}"
//   },
//   "referenceSolutions": {
//     "PYTHON": "import sys\nlines = sys.stdin.read().strip().split('\\n')\nnums = list(map(int, lines)) if lines[0] != '' else []\n\ndef longest_consecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            current = num\n            streak = 1\n            while current + 1 in num_set:\n                current += 1\n                streak += 1\n            longest = max(longest, streak)\n    return longest\n\nprint(str(longest_consecutive(nums)))",
//     "JAVASCRIPT": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst nums = input ? input.split('\\n').map(Number) : [];\n\nfunction longestConsecutive(nums) {\n    const set = new Set(nums);\n    let longest = 0;\n    for (let num of set) {\n        if (!set.has(num - 1)) {\n            let current = num;\n            let streak = 1;\n            while (set.has(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = Math.max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nconsole.log(longestConsecutive(nums));",
//     "JAVA": "import java.util.*;\n\npublic class Main {\n    public static int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int num : nums) set.add(num);\n        int longest = 0;\n        for (int num : set) {\n            if (!set.contains(num - 1)) {\n                int current = num;\n                int streak = 1;\n                while (set.contains(current + 1)) {\n                    current++;\n                    streak++;\n                }\n                longest = Math.max(longest, streak);\n            }\n        }\n        return longest;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> nums = new ArrayList<>();\n        while (sc.hasNextLine()) {\n            String line = sc.nextLine();\n            if (line.equals(\"\")) break;\n            nums.add(Integer.parseInt(line));\n        }\n        int[] arr = nums.stream().mapToInt(i -> i).toArray();\n        System.out.println(longestConsecutive(arr));\n    }\n}",
//     "CPP": "#include <iostream>\n#include <unordered_set>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint longestConsecutive(vector<int>& nums) {\n    unordered_set<int> num_set(nums.begin(), nums.end());\n    int longest = 0;\n    for (int num : num_set) {\n        if (!num_set.count(num - 1)) {\n            int current = num;\n            int streak = 1;\n            while (num_set.count(current + 1)) {\n                current++;\n                streak++;\n            }\n            longest = max(longest, streak);\n        }\n    }\n    return longest;\n}\n\nint main() {\n    string line;\n    vector<int> nums;\n    while (getline(cin, line) && !line.empty()) {\n        nums.push_back(stoi(line));\n    }\n    cout << longestConsecutive(nums) << endl;\n    return 0;\n}"
//   },
//   "hints": "Put all numbers into a set for O(1) lookups. Only start counting when the previous number doesn't exist."
// }
