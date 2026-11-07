import { destinations } from "../data/content.js";
import { app, $, element, upperKeepLambda } from "../state.js";

export function buildDOM(visit: (id: string) => void): void {
  $("coord").textContent =
    `${String(destinations.length).padStart(2, "0")} DESTINATIONS · ${destinations.reduce((sum, world) => sum + (world.moons?.length || 0), 0)} MOONS`;
  $("flight-count").textContent = `${destinations.length} destinations`;

  for (const destination of destinations) {
    const label = element("button", "destination-label");
    label.append(
      element("strong", "", upperKeepLambda(destination.name)),
      element("small", "", destination.category.toUpperCase()),
    );
    label.setAttribute(
      "aria-label",
      `Visit ${destination.name}: ${destination.category}`,
    );
    label.addEventListener("click", () => visit(destination.id));
    $("labels").append(label);
    app.labels.set(destination.id, label);

    const card = element("button", "dest-card");
    card.dataset.destination = destination.id;
    card.setAttribute(
      "aria-label",
      `Visit ${destination.name}: ${destination.category}`,
    );
    card.append(element("span", `orb ${destination.id}`));
    const text = element("span");
    text.append(
      element("strong", "", destination.name),
      element("small", "", destination.category),
    );
    card.append(text, element("span", "num mono", destination.number));
    card.addEventListener("click", () => visit(destination.id));
    $("cards").append(card);
    app.cards.set(destination.id, card);

    const row = element("button", "index-row");
    row.append(element("span", "row-num mono", destination.number));
    const rowText = element("span");
    rowText.append(
      element("strong", "", destination.name),
      element("small", "", destination.category),
    );
    row.append(rowText, element("span", "arrow", "↗"));
    row.addEventListener("click", () => {
      ($("index-dialog") as HTMLDialogElement).close();
      visit(destination.id);
    });
    $("index-list").append(row);
  }
}
