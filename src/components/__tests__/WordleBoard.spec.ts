import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
//* definir des variables dans settings
// Utilsable dans le test ET dans le component
import {
  DEFEAT_MESSAGE,
  VICTORY_MESSAGE,
  WORD_SIZE,
  END_GAME_ATTEMPT,
} from "@/settings";
import exp from "constants";

describe("WordleBoard", () => {
  // REFACTORISER, je peux utiliser les fonctions, objet, variable pour refactoriser le code de test
  // comme du JS
  let wordOfTheDay: string = "TESTS";

  // code qui est commun au test du describe WordleBoard
  // avant chaque test; execute ce code
  //----------------------------------
  let wrapper: ReturnType<typeof mount>;
  // wrapper prendra toujours en retour de la méthode mount()
  beforeEach((): void => {
    // Arrange - le mount
    wrapper = mount(WordleBoard, {
      props: { wordOfTheDay: wordOfTheDay },
    });
  });

  async function playerPressingEnter(): Promise<void> {
    await wrapper.find("input[type=text]").trigger("keydown.enter");
  }

  async function playerTypesGuess(word: string): Promise<void> {
    await wrapper.find("input[type=text]").setValue(word);
  }

  async function playerSubmitAndTypeGuess(word: string): Promise<void> {
    // Act - action
    await playerTypesGuess(word);
    await playerPressingEnter();
  }

  //----------------------------------

  //----------------------------------
  // TOUS LES TESTS
  // placeholder test to do later
  // test.todo("Defeat message appears if the user type the wrong word");

  // ORGANISATION - grouper les tests = ARCHITECTURE
  // POUR GROUPER LES TEST, JE LES METS DANS UN AUTRE describe

  describe("End of games messages", () => {
    test("A victory message when user type the right word", async () => {
      await playerSubmitAndTypeGuess(wordOfTheDay);
      // Assert - evalue
      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    describe.each([
      { numberOfGuess: 0, shouldSeeDefeatMessage: false },
      { numberOfGuess: 1, shouldSeeDefeatMessage: false },
      { numberOfGuess: 2, shouldSeeDefeatMessage: false },
      { numberOfGuess: 3, shouldSeeDefeatMessage: false },
      { numberOfGuess: 4, shouldSeeDefeatMessage: false },
      { numberOfGuess: 5, shouldSeeDefeatMessage: false },
      { numberOfGuess: END_GAME_ATTEMPT, shouldSeeDefeatMessage: true },
    ])(
      "A defeat message should appear if user make 6 worng attempts",
      async ({ numberOfGuess, shouldSeeDefeatMessage }) => {
        test(`Therefore each guess ${numberOfGuess}, defeat message shoud ${
          shouldSeeDefeatMessage ? "" : "not"
        } appear`, async () => {
          for (let index = 0; index < numberOfGuess; index++) {
            await playerSubmitAndTypeGuess("WRONG");
          }
          if (shouldSeeDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
          }
        });
      }
    );
    // si utilisateur n'a rien tapé, je ne renvoie aucun de ces messages
    test("no end of game if the user has not make a guess yet", async () => {
      // Assert - evalue
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
    });
    test("A button is displayed at the end of the game to ask if the user want to play again", async () => {
      expect(wrapper.text()).not.toContain("Play again");
      await playerSubmitAndTypeGuess(wordOfTheDay);
      expect(wrapper.text()).toContain("Play again");
    });
  });
  describe("Restart the game", () => {
    beforeEach(async () => {
      await playerSubmitAndTypeGuess(wordOfTheDay);
      await wrapper.find("button[type=reset]").trigger("click");
    });
    test("When click on button play again, all the message disappear", async () => {
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      /* expect(
        wrapper.find("input[type=text]").attributes("focus")
      ).not.toBeUndefined(); */
    });
    test("When click on button play again, an event is emit to empty the trigger a restart on parent", async () => {
      expect(wrapper.emitted()).toHaveProperty("restart-game");
    });
  });

  describe("Rules of the games", () => {
    beforeEach(() => {
      console.warn = vi.fn();
    });
    // each permet de faire le test autant de fois qu'il y a d'éléments dans le tableau
    test.each([
      { wordFromArray: "FLY", reason: "must be 5 5characters length" },
      { wordFromArray: "card", reason: "must be uppercase" },
      { wordFromArray: "AAAAA", reason: "must be a real word" },
    ])(
      "The word of the day is $wordFromArray but $reason",
      async (objectFomEach) => {
        // prendra la valeur de chaque élément dans le tableau
        // pour espionner la console et voir si il y a un warning
        //* a executer avant le mount !

        // OPTION pour masquer le warning dans le test
        /* const spy = vi.spyOn(console, "warn");
      spy.mockImplementation(() => null); */
        //----------------------------------------

        mount(WordleBoard, {
          props: { wordOfTheDay: objectFomEach.wordFromArray },
        });
        // si j'envoie un mot de moins de 5 lettres, j'ai bien un console warnning coté navigateur
        // le warning s'affiche aussi dans le test
        expect(console.warn).toHaveBeenCalled();
      }
    );
    test("No warning if the word of the day is real, uppercase and contain  letter", async () => {
      mount(WordleBoard, {
        props: { wordOfTheDay: "TESTS" },
      });
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
  describe("player input", () => {
    test("Input has to be always focus", async () => {
      document.body.innerHTML = "<div id='app'></div>";
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay: wordOfTheDay },
        attachTo: "#app",
      });
      expect(
        wrapper.find("input[type=text]").attributes("autofocus")
      ).not.toBeUndefined();
      // decleneche un event
      await wrapper.find("input[type=text]").trigger("blur");
      // savoir quel element est actif (focus)
      expect(document.activeElement).toBe(
        wrapper.find("input[type=text]").element
      );
    });
    test("input should be reset after every submission", async () => {
      await playerSubmitAndTypeGuess("WRONG");
      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toBe("");
    });
    test("input should be disabled after 6 attempts", async () => {
      const guesses = ["WRONG", "TESTS", "WRONG", "TESTS", "WRONG", "TESTS"];
      for (const guess of guesses) {
        await playerSubmitAndTypeGuess(guess);
      }
      expect(
        wrapper
          .find<HTMLInputElement>("input[type=text]")
          .attributes("disabled")
      ).not.toBeUndefined();
    });
    test("input should be disabled after success to find the word of the day", async () => {
      await playerSubmitAndTypeGuess(wordOfTheDay);
      expect(
        wrapper
          .find<HTMLInputElement>("input[type=text]")
          .attributes("disabled")
      ).not.toBeUndefined();
    });
    test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerSubmitAndTypeGuess(wordOfTheDay + "EXTRAS");

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test("player guesses can only be submited if they are real words", async () => {
      await playerSubmitAndTypeGuess("QWERT");

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });
    test("player guesses are not case-sensitive", async () => {
      await playerSubmitAndTypeGuess(wordOfTheDay.toLowerCase());

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test("player guesses can only contains letters", async () => {
      await playerTypesGuess("HR3");

      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toEqual("HR");
    });
    /* test("do not show non letter characters when the user type", async () => {
      await playerSubmitAndTypeGuess("333");
      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toEqual("");
    }); */
  });
  test("All guesses are display during the game", async () => {
    const guesses = ["WRONG", "TESTS", "WRONG", "TESTS"];
    for (const guess of guesses) {
      await playerSubmitAndTypeGuess(guess);
    }
    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess);
    }
  });
});
