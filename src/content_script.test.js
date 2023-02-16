/**
 * @jest-environment jsdom
 */

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

describe("addActionsButtons", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="root">
      <form>
        <h1 class="text-4x1">open screen</h1>
        <div>
          <div>
            <button id="try-again-button">Try again</button>
          </div>
        </div>
      </form>
    </div>
      `;
    require("./content_script.js");
    jest.advanceTimersByTime(200);
  });

  it("should add buttons", () => {
    const root = document.querySelector("#root");
    expect(root.querySelector("#try-again-button")).not.toBeNull();
    expect(root.querySelector("#\\#download-png-button")).not.toBeNull();
    expect(root.querySelector("#\\#download-pdf-button")).not.toBeNull();
    expect(root.querySelector("#\\#download-html-button")).not.toBeNull();
  });
});
