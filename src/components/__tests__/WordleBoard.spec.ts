import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
//* definir des variables dans settings
// Utilsable dans le test ET dans le component
import { DEFEAT_MESSAGE, VICTORY_MESSAGE, WORD_SIZE } from "@/settings";
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

  async function playerSubmitGuess(word: string): Promise<void> {
    // Act - action
    const guessInput: DOMWrapper<Element> = wrapper.find("input[type=text]");
    await guessInput.setValue(word);
    await guessInput.trigger("keydown.enter");
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
      await playerSubmitGuess(wordOfTheDay);
      // Assert - evalue
      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test("Defeat message appears if the user type the wrong word", async () => {
      await playerSubmitGuess("WRONG");
      // Assert - evalue
      expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
    });
    // si utilisateur n'a rien tapé, je ne renvoie aucun de ces messages
    test("no end of game if the user has not make a guess yet", async () => {
      // Assert - evalue
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
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
    test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerSubmitGuess(wordOfTheDay + "EXTRAS");

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test("player guesses can only be submited if they are real words", async () => {
      await playerSubmitGuess("QWERT");

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });
    test("player guesses are not case-sensitive", async () => {
      await playerSubmitGuess(wordOfTheDay.toLowerCase());

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test("player guesses can only contains letters", async () => {
      await playerSubmitGuess("H3R!T");

      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toEqual("HRT");
    });
    /* test("do not show non letter characters when the user type", async () => {
      await playerSubmitGuess("333");
      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toEqual("");
    }); */
  });
});
