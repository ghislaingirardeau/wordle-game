import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
//* definir des variables dans settings
// Utilsable dans le test ET dans le component
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from "@/settings";
import exp from "constants";

describe("WordleBoard", () => {
  // REFACTORISER, je peux utiliser les fonctions, objet, variable pour refactoriser le code de test
  // comme du JS
  let wordOfTheDay: string = "TEST";

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
  test("A victory message when user type the right word", async () => {
    await playerSubmitGuess(wordOfTheDay);
    // Assert - evalue
    expect(wrapper.text()).toContain(VICTORY_MESSAGE);
  });
  //----------------------------------

  //----------------------------------
  // TOUS LES TESTS
  // placeholder test to do later
  // test.todo("Defeat message appears if the user type the wrong word");
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
  test("If the word of the day do not have exactly 5 letters, a warning is emitted ", async () => {
    // pour espionner la console et voir si il y a un warning
    //* a executer avant le mount !
    console.warn = vi.fn();

    // OPTION pour masquer le warning dans le test
    /* const spy = vi.spyOn(console, "warn");
    spy.mockImplementation(() => null); */
    //----------------------------------------

    mount(WordleBoard, {
      props: { wordOfTheDay: "FLY" },
    });
    // si j'envoie un mot de moins de 5 lettres, j'ai bien un console warnning coté navigateur
    // le warning s'affiche aussi dans le test
    expect(console.warn).toHaveBeenCalled();
  });
  test("If the word of the day is not uppercase, a warning is emitted ", async () => {
    console.warn = vi.fn();
    mount(WordleBoard, {
      props: { wordOfTheDay: "card" },
    });
    expect(console.warn).toHaveBeenCalled();
  });
  test("If the word of the day is not a really word, a warning is emitted ", async () => {
    console.warn = vi.fn();
    mount(WordleBoard, {
      props: { wordOfTheDay: "QQQQQ" },
    });
    expect(console.warn).toHaveBeenCalled();
  });
});
