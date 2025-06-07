import React, { useEffect } from "react";

import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const ProblemsListPage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  // useEffect(() => {
  //   getAllProblems();
  // }, [getAllProblems]);

  if(isProblemsLoading){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060A14] flex flex-col items-center mt-16 px-4">
      {
        problems.length > 0 ? <ProblemTable problems={problems}/> : (
            <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No problems found
        </p>
        )
      }
    </div>
  );
};

export default ProblemsListPage;