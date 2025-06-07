import React, { useEffect } from "react";
import Container from "../components/Container";
import Features from "../components/Features";
import Hero from "../components/Hero"; 
import Footer from "../components/Footer";
import { useProblemStore } from "../store/useProblemStore";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  
  useEffect(() => {
      getAllProblems();
    }, [getAllProblems]);

  return (
    <>
    <Container>
      <Hero />
      <Features />
      <Counts />
        <Footer />
    </Container>
    </>
  );
}

export default HomePage;
