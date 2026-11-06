import { expect, it } from "vitest";
import { countCompetences } from "../../src/view/components/charts/competenceCounts";

it("conta candidatos por competência da vaga sem duplicar candidatos", () => {
  expect(countCompetences({ skills: ["Groovy", "Java", "SQL", "Java"] }, [
    { skills: ["Java", "Java", "Groovy"] },
    { skills: ["Java"] },
  ])).toEqual({ labels: ["Groovy", "Java", "SQL"], data: [1, 2, 0] });
});
