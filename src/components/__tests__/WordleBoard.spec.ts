import { DOMWrapper, VueWrapper, mount } from "@vue/test-utils";
import WordleBoard from "../WordleBoard.vue";
//* definir des variables dans settings
// Utilsable dans le test ET dans le component
import { VICTORY_MESSAGE } from "@/settings";

describe("WordleBoard", () => {
  it("A victory message when user type the right word", async () => {
    // Arrange - le mount
    const wrapper: VueWrapper = mount(WordleBoard, {
      props: { wordOfTheDay: "TEST" },
    });
    // Act - action
    const guessInput: DOMWrapper<Element> = wrapper.find("input[type=text]");
    await guessInput.setValue("TEST");
    await guessInput.trigger("keydown.enter");
    // Assert - evalue
    expect(wrapper.text()).toContain(VICTORY_MESSAGE);
  });
});
