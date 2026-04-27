(function () {
  var root = document.documentElement;
  var body = document.body;
  var themeBtn = document.getElementById("theme-btn");
  var progress = document.getElementById("page-progress");

  function icon(theme) {
    if (theme === "dark") {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>';
    }

    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0A7 7 0 0 0 21 12.79z"></path></svg>';
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("pc-theme", theme);
    } catch (err) {}
    if (themeBtn) {
      themeBtn.innerHTML = icon(theme);
      themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
      );
    }
  }

  try {
    setTheme(localStorage.getItem("pc-theme") || "dark");
  } catch (err) {
    setTheme("dark");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      body.classList.add("theme-transition");
      setTheme(nextTheme);
      setTimeout(function () {
        body.classList.remove("theme-transition");
      }, 250);
    });
  }

  document.querySelectorAll(".js-year").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  if (progress) {
    var updateProgress = function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      progress.style.width = String(ratio * 100) + "%";
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  function normalizePath(url) {
    try {
      return new URL(url, window.location.origin).pathname.replace(/\/?$/, "/");
    } catch (err) {
      return String(url || "").replace(/\/?$/, "/");
    }
  }

  function formatDateLabel(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date).replace(/\./g, "");
  }

  function getPostMeta(postItem) {
    var titleNode = postItem.querySelector(".post-card-title");
    var linkNode = postItem.querySelector(".post-card-link");
    var dateNode = postItem.querySelector(".post-date");
    var title = (postItem.dataset.postTitle || (titleNode && titleNode.textContent) || "").trim();
    var href = linkNode ? normalizePath(linkNode.getAttribute("href") || linkNode.href || "") : "";
    var dateValue = postItem.dataset.postDate || (dateNode && dateNode.getAttribute("datetime")) || "";
    var dateMs = dateValue ? Date.parse(dateValue) : Number.NaN;

    return {
      title: title,
      href: href,
      dateValue: dateValue,
      dateMs: dateMs,
      order: Number(postItem.dataset.postOrder || "0")
    };
  }

  function ensurePostDate(postItem, isoDate, dateLabel) {
    if (!isoDate || !dateLabel) {
      return;
    }

    var linkNode = postItem.querySelector(".post-card-link");
    if (!linkNode) {
      return;
    }

    var metaRow = postItem.querySelector(".post-meta-row");
    if (!metaRow) {
      metaRow = document.createElement("div");
      metaRow.className = "post-meta-row";
      linkNode.insertBefore(metaRow, linkNode.firstChild);
    }

    var timeNode = metaRow.querySelector(".post-date");
    if (!timeNode) {
      timeNode = document.createElement("time");
      timeNode.className = "post-date";
      metaRow.appendChild(timeNode);
    }

    timeNode.setAttribute("datetime", isoDate);
    timeNode.textContent = dateLabel;
    postItem.dataset.postDate = isoDate;
  }

  function setupBackToTop() {
    var isBlogPost = document.querySelector(".page-shell--blog-post");
    var button = document.getElementById("back-top");

    if (!button && isBlogPost) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "back-top";
      button.className = "back-top";
      button.setAttribute("aria-label", "Voltar ao topo");
      button.setAttribute("title", "Voltar ao topo");
      button.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';
      document.body.appendChild(button);
    } else if (button && !button.classList.contains("back-top")) {
      button.classList.add("back-top");
    }

    if (!button) {
      return;
    }

    var syncButton = function () {
      button.classList.toggle("is-visible", (window.scrollY || document.documentElement.scrollTop) > 300);
    };

    syncButton();
    window.addEventListener("scroll", syncButton, { passive: true });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  async function setupBlogIndex() {
    var postList = document.querySelector("[data-post-list]");
    var sortMenu = document.querySelector("[data-sort-menu]");
    var sortTrigger = document.querySelector("[data-sort-trigger]");
    var sortCurrent = document.querySelector("[data-sort-current]");
    var sortOptions = Array.prototype.slice.call(document.querySelectorAll("[data-sort-value]"));
    var viewButtons = Array.prototype.slice.call(document.querySelectorAll("[data-view-value]"));

    if (!postList || !sortMenu || !sortTrigger || !sortOptions.length || !viewButtons.length) {
      return;
    }

    var sortLabels = {
      "title-asc": "A a Z",
      "title-desc": "Z a A",
      "date-desc": "Mais recentes primeiro",
      "date-asc": "Mais antigos primeiro"
    };
    var collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
    var postItems = Array.prototype.slice.call(postList.querySelectorAll("[data-post-item]"));
    var feedUrl = postList.getAttribute("data-feed-url");
    var activeSort = postList.getAttribute("data-sort") || "date-desc";
    var activeView = postList.getAttribute("data-view") || "grid";

    postItems.forEach(function (item, index) {
      item.dataset.postOrder = String(index);
    });

    async function enrichFromFeed() {
      if (!feedUrl) {
        return;
      }

      try {
        var response = await fetch(feedUrl, { credentials: "same-origin" });
        if (!response.ok) {
          throw new Error("feed-request-failed");
        }

        var xmlText = await response.text();
        var xml = new DOMParser().parseFromString(xmlText, "application/xml");
        var items = xml.querySelectorAll("item");
        var feedMap = new Map();

        items.forEach(function (item) {
          var linkNode = item.querySelector("link");
          var titleNode = item.querySelector("title");
          var pubDateNode = item.querySelector("pubDate");

          if (!linkNode || !pubDateNode) {
            return;
          }

          var pubDate = new Date(pubDateNode.textContent.trim());
          if (Number.isNaN(pubDate.getTime())) {
            return;
          }

          feedMap.set(normalizePath(linkNode.textContent.trim()), {
            title: titleNode ? titleNode.textContent.trim() : "",
            dateIso: pubDate.toISOString().slice(0, 10),
            dateLabel: formatDateLabel(pubDate)
          });
        });

        postItems.forEach(function (postItem) {
          var meta = getPostMeta(postItem);
          var feedMeta = feedMap.get(meta.href);

          if (!feedMeta) {
            return;
          }

          if (!postItem.dataset.postTitle && feedMeta.title) {
            postItem.dataset.postTitle = feedMeta.title;
          }

          if (!meta.dateValue && feedMeta.dateIso) {
            ensurePostDate(postItem, feedMeta.dateIso, feedMeta.dateLabel);
          }
        });
      } catch (err) {
        console.warn("Nao foi possivel carregar metadados do feed do blog.", err);
      }
    }

    function sortPosts(sortValue) {
      activeSort = sortValue;
      postList.setAttribute("data-sort", sortValue);

      var sortedItems = postItems.slice().sort(function (a, b) {
        var metaA = getPostMeta(a);
        var metaB = getPostMeta(b);

        if (sortValue === "title-asc") {
          return collator.compare(metaA.title, metaB.title);
        }

        if (sortValue === "title-desc") {
          return collator.compare(metaB.title, metaA.title);
        }

        if (sortValue === "date-asc") {
          if (Number.isNaN(metaA.dateMs) && Number.isNaN(metaB.dateMs)) {
            return metaA.order - metaB.order;
          }
          if (Number.isNaN(metaA.dateMs)) {
            return 1;
          }
          if (Number.isNaN(metaB.dateMs)) {
            return -1;
          }
          return metaA.dateMs - metaB.dateMs || collator.compare(metaA.title, metaB.title);
        }

        if (Number.isNaN(metaA.dateMs) && Number.isNaN(metaB.dateMs)) {
          return metaB.order - metaA.order;
        }
        if (Number.isNaN(metaA.dateMs)) {
          return 1;
        }
        if (Number.isNaN(metaB.dateMs)) {
          return -1;
        }
        return metaB.dateMs - metaA.dateMs || collator.compare(metaA.title, metaB.title);
      });

      var fragment = document.createDocumentFragment();
      sortedItems.forEach(function (item) {
        fragment.appendChild(item);
      });
      postList.appendChild(fragment);

      sortOptions.forEach(function (option) {
        var isActive = option.getAttribute("data-sort-value") === sortValue;
        option.setAttribute("aria-checked", String(isActive));
      });

      if (sortCurrent) {
        sortCurrent.textContent = sortLabels[sortValue] || sortValue;
      }
    }

    function setView(viewValue) {
      activeView = viewValue;
      postList.setAttribute("data-view", viewValue);
      viewButtons.forEach(function (button) {
        var isActive = button.getAttribute("data-view-value") === viewValue;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    function getMenuPanel() {
      return document.getElementById(sortTrigger.getAttribute("aria-controls"));
    }

    function closeSortMenu() {
      var panel = getMenuPanel();
      sortTrigger.setAttribute("aria-expanded", "false");
      if (panel) {
        panel.hidden = true;
      }
    }

    function openSortMenu() {
      var panel = getMenuPanel();
      sortTrigger.setAttribute("aria-expanded", "true");
      if (panel) {
        panel.hidden = false;
      }
    }

    function toggleSortMenu() {
      if (sortTrigger.getAttribute("aria-expanded") === "true") {
        closeSortMenu();
      } else {
        openSortMenu();
      }
    }

    await enrichFromFeed();
    sortPosts(activeSort);
    setView(activeView);
    closeSortMenu();

    sortTrigger.addEventListener("click", toggleSortMenu);
    sortTrigger.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSortMenu();
        sortOptions[0].focus();
      }
    });

    sortOptions.forEach(function (option, index) {
      option.addEventListener("click", function () {
        sortPosts(option.getAttribute("data-sort-value"));
        closeSortMenu();
        sortTrigger.focus();
      });

      option.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          closeSortMenu();
          sortTrigger.focus();
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          sortOptions[(index + 1) % sortOptions.length].focus();
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          sortOptions[(index - 1 + sortOptions.length) % sortOptions.length].focus();
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!sortMenu.contains(event.target)) {
        closeSortMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeSortMenu();
      }
    });

    viewButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setView(button.getAttribute("data-view-value"));
      });
    });
  }

  setupBackToTop();
  setupBlogIndex();
})();
