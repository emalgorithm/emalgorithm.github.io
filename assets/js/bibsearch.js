import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", function () {
  const selectors = {
    entry: ".bibliography > li",
    groupHeading: "h2.bibliography",
    searchInput: "bibsearch",
    topicButton: ".publication-topic-filter",
    topicMetadata: "[data-topics]",
  };
  const params = {
    search: "q",
    topic: "topic",
  };
  const allTopic = "all";
  const searchInput = document.getElementById(selectors.searchInput);
  const topicButtons = Array.from(document.querySelectorAll(selectors.topicButton));
  let activeTopic = "all";

  if (!searchInput) {
    return;
  }

  const entryTopics = (entry) => {
    const topicElement = entry.querySelector(selectors.topicMetadata);
    const topics = topicElement ? topicElement.dataset.topics : "";
    return topics.split(/[,\s]+/).filter(Boolean);
  };

  const setActiveTopic = (topic) => {
    const matchingButton = topicButtons.find((button) => button.dataset.topic === topic);
    activeTopic = matchingButton ? topic : allTopic;

    topicButtons.forEach((topicButton) => {
      const isActive = topicButton.dataset.topic === activeTopic;
      topicButton.classList.toggle("active", isActive);
      topicButton.setAttribute("aria-pressed", isActive.toString());
    });
  };

  const syncUrl = ({ replace = false } = {}) => {
    const url = new URL(window.location.href);
    const trimmedSearchTerm = searchInput.value.trim();

    if (trimmedSearchTerm) {
      url.searchParams.set(params.search, trimmedSearchTerm);
    } else {
      url.searchParams.delete(params.search);
    }

    if (activeTopic === allTopic) {
      url.searchParams.delete(params.topic);
    } else {
      url.searchParams.set(params.topic, activeTopic);
    }

    if (url.hash) {
      const hashValue = decodeURIComponent(url.hash.substring(1));
      if (hashValue && !document.getElementById(hashValue)) {
        url.hash = "";
      }
    }

    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", url);
  };

  const getSearchTermFromUrl = () => {
    const querySearchTerm = new URLSearchParams(window.location.search).get(params.search);
    if (querySearchTerm !== null) {
      return querySearchTerm;
    }

    const hashValue = decodeURIComponent(window.location.hash.substring(1)); // Remove the '#' character
    return hashValue && !document.getElementById(hashValue) ? hashValue : "";
  };

  const setStateFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    setActiveTopic(urlParams.get(params.topic) || allTopic);
    searchInput.value = getSearchTermFromUrl();
  };

  const hideEmptyGroups = () => {
    document.querySelectorAll(selectors.groupHeading).forEach(function (element) {
      let iterator = element.nextElementSibling; // get next sibling element after h2, which can be h3 or ol
      let hideFirstGroupingElement = true;
      // iterate until next group element (h2), which is already selected by the querySelectorAll(-).forEach(-)
      while (iterator && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          const ol = iterator;
          const unloadedSiblings = ol.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = ol.querySelectorAll(":scope > li");

          if (unloadedSiblings.length === totalSiblings.length) {
            ol.previousElementSibling.classList.add("unloaded"); // Add the '.unloaded' class to the previous grouping element (e.g. year)
            ol.classList.add("unloaded"); // Add the '.unloaded' class to the OL itself
          } else {
            hideFirstGroupingElement = false; // there is at least some visible entry, don't hide the first grouping element
          }
        }
        iterator = iterator.nextElementSibling;
      }
      // Add unloaded class to first grouping element (e.g. year) if no item left in this group
      if (hideFirstGroupingElement) {
        element.classList.add("unloaded");
      }
    });
  };

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    document.querySelectorAll(".bibliography, .unloaded").forEach((element) => element.classList.remove("unloaded"));

    let nonMatchingSearchElements = new Set();

    if (CSS.highlights) {
      const nonMatchingElements = highlightSearchTerm({ search: searchTerm, selector: selectors.entry });
      if (nonMatchingElements) {
        nonMatchingSearchElements = new Set(nonMatchingElements);
      }
    }

    document.querySelectorAll(selectors.entry).forEach((element) => {
      const topics = entryTopics(element);
      const matchesTopic = activeTopic === allTopic || topics.includes(activeTopic);
      const text = element.innerText.toLowerCase();
      const matchesSearch = searchTerm === "" || (CSS.highlights ? !nonMatchingSearchElements.has(element) : text.includes(searchTerm));

      if (!matchesTopic || !matchesSearch) {
        element.classList.add("unloaded");
      }
    });

    hideEmptyGroups();
  };

  // Sensitive search. Only start searching if there's been no input for 300 ms
  let timeoutId;
  searchInput.addEventListener("input", function () {
    clearTimeout(timeoutId); // Clear the previous timeout
    timeoutId = setTimeout(() => {
      syncUrl({ replace: true });
      applyFilters();
    }, 300);
  });

  topicButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setActiveTopic(this.dataset.topic || allTopic);
      syncUrl();
      applyFilters();
    });
  });

  window.addEventListener("hashchange", function () {
    setStateFromUrl();
    applyFilters();
  });
  window.addEventListener("popstate", function () {
    setStateFromUrl();
    applyFilters();
  });

  setStateFromUrl();
  applyFilters();
});
