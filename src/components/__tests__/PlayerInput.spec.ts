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
// @ts-ignore: Unreachable code error
window.scrollTo = vi.fn();

describe("player input", () => {
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

  test("Input has to be always focus", async () => {
    document.body.innerHTML = "<div id='app'></div>";
    wrapper = mount(WordleBoard, {
      props: {
        wordOfTheDay: wordOfTheDay,
        wordsListLang: englishWord,
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
      wrapper.find<HTMLInputElement>("input[type=text]").attributes("disabled")
    ).not.toBeUndefined();
  });
  test("input should be disabled after success to find the word of the day", async () => {
    await playerSubmitAndTypeGuess(wordOfTheDay);
    expect(
      wrapper.find<HTMLInputElement>("input[type=text]").attributes("disabled")
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
    openModalInformation("This word does not exist in the list", "p", "error");
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
