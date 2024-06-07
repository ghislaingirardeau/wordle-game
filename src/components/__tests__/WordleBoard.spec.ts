import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
//* definir des variables dans settings
// Utilsable dans le test ET dans le component
import {
  DEFEAT_MESSAGE,
  VICTORY_MESSAGE,
  WORD_SIZE,
  END_GAME_ATTEMPT,
  CURRENT_LANGUAGES,
} from "@/settings";
import englishWord from "@/utils/englishWordsWith5Letters.json";
import frenchWords from "@/utils/wordsFr5.json";

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
      props: {
        wordOfTheDay: wordOfTheDay,
        wordsListLang: englishWord,
      },
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

  /**
   * 2 modals inside the game, one to show end game info, one to show error game info
   * @param message
   * @param tagElement
   * @param modalType
   */
  function openModalInformation(
    message: string,
    tagElement: string = "p",
    modalType: string
  ): void {
    const modal = wrapper.find(`#info-modal-${modalType}`);
    expect(modal.classes()).not.toContain("hidden");
    expect(modal.find(tagElement).text()).toBe(message);
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
      setTimeout(() => {
        openModalInformation(VICTORY_MESSAGE, "h2", "game");
      }, 1300);
    });

    describe.each([
      { numberOfGuess: 0, shouldSeeDefeatMessage: false },
      { numberOfGuess: 1, shouldSeeDefeatMessage: false },
      { numberOfGuess: 2, shouldSeeDefeatMessage: false },
      { numberOfGuess: 3, shouldSeeDefeatMessage: false },
      { numberOfGuess: 4, shouldSeeDefeatMessage: false },
      { numberOfGuess: 5, shouldSeeDefeatMessage: false },
      { numberOfGuess: END_GAME_ATTEMPT.value, shouldSeeDefeatMessage: true },
    ])(
      "A defeat message should appear if user make 6 wrong attempts",
      async ({ numberOfGuess, shouldSeeDefeatMessage }) => {
        test(`Therefore each guess ${numberOfGuess}, defeat message shoud ${
          shouldSeeDefeatMessage ? "" : "not"
        } appear`, async () => {
          for (let index = 0; index < numberOfGuess; index++) {
            await playerSubmitAndTypeGuess("WRONG");
          }
          if (shouldSeeDefeatMessage) {
            setTimeout(() => {
              openModalInformation(
                DEFEAT_MESSAGE + " The word to find was: " + wordOfTheDay,
                "h2",
                "game"
              );
            }, 1300);

            // expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
          } else {
            // expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
            const modal = wrapper.find("#info-modal-game");
            expect(modal.classes()).toContain("hidden");
          }
        });
      }
    );
    // si utilisateur n'a rien tapé, je ne renvoie aucun de ces messages
    test("no end of game if the user has not make a guess yet", async () => {
      const modal = wrapper.find("#info-modal-game");
      expect(modal.classes()).toContain("hidden");
    });
    test("A button is displayed at the end of the game to ask if the user want to play again", async () => {
      const modal = wrapper.find("#info-modal-game");
      expect(modal.classes()).toContain("hidden");
      await playerSubmitAndTypeGuess(wordOfTheDay);
      setTimeout(() => {
        expect(modal.classes()).not.toContain("hidden");
        expect(modal.find("button[name=reset]").text()).toContain("Play again");
      }, 1300);
    });
  });
  describe("Restart the game", () => {
    beforeEach(async () => {
      await playerSubmitAndTypeGuess(wordOfTheDay);
      await wrapper.find("button[name=reset]").trigger("click");
    });
    test("When click on button play again, all the message disappear", async () => {
      const modal = wrapper.find("#info-modal-game");
      expect(modal.classes()).toContain("hidden");
      expect(modal.find("h2").text()).not.toContain(VICTORY_MESSAGE);
      /* expect(
        wrapper.find("input[type=text]").attributes("focus")
      ).not.toBeUndefined(); */
    });
    test("When click on button play again, an event is emit to empty the trigger a restart on parent", async () => {
      expect(wrapper.emitted()).toHaveProperty("restart-game");
    });
  });
  describe("Rules of the games", () => {
    // CHECK PROPS VALIDATOR wordleBoard component
    beforeEach(() => {
      console.warn = vi.fn();
    });
    // each permet de faire le test autant de fois qu'il y a d'éléments dans le tableau
    test.each([
      { wordFromArray: "FLY", reason: "must be 5 characters length" },
      { wordFromArray: "card", reason: "must be uppercase" },
      { wordFromArray: "AAAAA", reason: "must be a real word" },
    ])(
      "The word of the day is $wordFromArray but $reason",
      async (objectFomEach) => {
        // prendra la valeur de chaque élément dans le tableau
        // pour espionner la console et voir si il y a un warning
        //* a executer avant le mount !

        // OPTION pour masquer le warning dans le test
        // const spy = vi.spyOn(console, "warn");
        // spy.mockImplementation(() => null);
        //----------------------------------------

        mount(WordleBoard, {
          props: {
            wordOfTheDay: objectFomEach.wordFromArray,
            wordsListLang: englishWord,
          },
        });
        // si j'envoie un mot de moins de 5 lettres, j'ai bien un console warnning coté navigateur
        // le warning s'affiche aussi dans le test
        expect(console.warn).toHaveBeenCalled();
      }
    );
    test("No warning if the word of the day is real, uppercase and contain letter", async () => {
      mount(WordleBoard, {
        props: { wordOfTheDay: "DIVER", wordsListLang: englishWord },
      });
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
  describe("Set options", () => {
    // level of difficulties
    test("Option to change the difficulty of the game on click", async () => {
      await wrapper
        .find(".actions_block h2[data-type=options]")
        .trigger("click");
      await wrapper.find(".tabs_container #level-medium").trigger("click");
      expect(END_GAME_ATTEMPT.value).toBe(6);
      await wrapper.find(".tabs_container #level-difficult").trigger("click");
      expect(END_GAME_ATTEMPT.value).toBe(4);
    });
    test("Option show rules content", async () => {
      await wrapper.find(".actions_block h2[data-type=rules]").trigger("click");
      expect(wrapper.find(".rules_container").text()).toContain(
        "Try to find a"
      );
    });
  });
  describe("player input", () => {
    test("Input has to be always focus", async () => {
      document.body.innerHTML = "<div id='app'></div>";
      wrapper = mount(WordleBoard, {
        props: {
          wordOfTheDay: wordOfTheDay,
          wordsListLang:
            CURRENT_LANGUAGES.value === "English" ? englishWord : frenchWords,
        },
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

      // "toContain" agit comme un "includes"
      // comme le début de la cdc est le mot de jour, le test est validé
      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });
    test("player guesses can only be submited if they are real words", async () => {
      await playerSubmitAndTypeGuess("QWERT");
      // test vérifie que la modal s'affiche bien lors d'une erreur
      openModalInformation(
        "This word does not exist in the list",
        "p",
        "error"
      );
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
      openModalInformation("Number is not permited", "p", "error");
    });
    test("player typing a new letter during error modal open should close modal", async () => {
      await playerTypesGuess("HR3");

      expect(
        wrapper.find<HTMLInputElement>("input[type=text]").element.value
      ).toEqual("HR");
      openModalInformation("Number is not permited", "p", "error");
      // la modale se ferme lorsque je tape une nouvelle lettre
      await playerTypesGuess("H");
      const modal = wrapper.find("#info-modal-error");
      // ou la modale se ferme lorsque je clique dessus
      // await modal.trigger("click");
      expect(modal.classes()).toContain("hidden");
    });
    test("player typing incorrect word should display the incorrects letters", async () => {
      await playerSubmitAndTypeGuess("TRAIN");
      const letterElement = (x: string) =>
        wrapper.find(`.helper_block span[data-letter="${x}"]`);
      expect(letterElement("A").classes()).toContain("bg-amber");
      expect(letterElement("N").classes()).toContain("bg-amber");
      expect(letterElement("R").classes()).toContain("bg-amber");
      expect(letterElement("I").classes()).toContain("bg-amber");
      // word of the day contain "t" so no bg amber
      expect(letterElement("T").classes()).not.toContain("bg-amber");
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
