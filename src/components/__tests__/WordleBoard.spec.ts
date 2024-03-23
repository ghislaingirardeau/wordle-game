import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
//* definir des variables dans settings
// Utilsable dans le test ET dans le component
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from "@/settings";

describe("WordleBoard", () => {
  let wordOfTheDay: string = "TEST";

  // code qui est commun au test du describe WordleBoard
  // avant chaque test; execute ce code
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
});
