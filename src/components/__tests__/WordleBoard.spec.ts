import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
//* definir des variables dans settings
// Utilsable dans le test ET dans le component
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from "@/settings";

describe("WordleBoard", () => {
  let wordOfTheDay: string = "TEST";
  test("A victory message when user type the right word", async () => {
    // Arrange - le mount
    const wrapper: VueWrapper = mount(WordleBoard, {
      props: { wordOfTheDay: wordOfTheDay },
    });
    // Act - action
    const guessInput: DOMWrapper<Element> = wrapper.find("input[type=text]");
    await guessInput.setValue(wordOfTheDay);
    await guessInput.trigger("keydown.enter");
    // Assert - evalue
    expect(wrapper.text()).toContain(VICTORY_MESSAGE);
  });
  // placeholder test to do later
  // test.todo("Defeat message appears if the user type the wrong word");
  test("Defeat message appears if the user type the wrong word", async () => {
    // Arrange - le mount
    const wrapper: VueWrapper = mount(WordleBoard, {
      props: { wordOfTheDay: wordOfTheDay },
    });
    // Act - action
    const guessInput: DOMWrapper<Element> = wrapper.find("input[type=text]");
    await guessInput.setValue("WRONG");
    await guessInput.trigger("keydown.enter");
    // Assert - evalue
    expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
  });
  test.todo("no end of game if the user has not make a guess");
});
