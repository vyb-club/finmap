const filterButtons = document.querySelectorAll(".filter-button");
const termCards = document.querySelectorAll(".term-card");
const termSearch = document.getElementById("termSearch");
const emptyState = document.getElementById("emptyState");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

let activeFilter = "all";

function applyFilters() {
  const query = termSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  termCards.forEach((card) => {
    const category = card.dataset.category;
    const title = card.dataset.title;
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !query || title.includes(query);
    const shouldShow = matchesFilter && matchesSearch;

    card.classList.toggle("hidden", !shouldShow);
    if (shouldShow) visibleCount += 1;
  });

  emptyState.classList.toggle("hidden", visibleCount > 0);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });
});

termSearch.addEventListener("input", applyFilters);

termCards.forEach((card) => {
  const trigger = card.querySelector(".term-trigger");
  trigger.addEventListener("click", () => {
    const isOpen = card.classList.contains("open");
    card.classList.toggle("open", !isOpen);
    trigger.setAttribute("aria-expanded", String(!isOpen));
  });
});

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("open");
});

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function calculateCosts(event) {
  event.preventDefault();

  const principal = Number(document.getElementById("investment").value);
  const returnRate = Number(document.getElementById("returnRate").value) / 100;
  const years = Number(document.getElementById("years").value);
  const expenseRatio = Number(document.getElementById("expenseRatio").value) / 100;

  const grossValue = principal * (1 + returnRate) ** years;
  const netRate = Math.max(returnRate - expenseRatio, 0);
  const netValue = principal * (1 + netRate) ** years;
  const costImpact = grossValue - netValue;

  document.getElementById("grossValue").textContent = formatter.format(grossValue);
  document.getElementById("netValue").textContent = formatter.format(netValue);
  document.getElementById("costValue").textContent = formatter.format(costImpact);
  document.getElementById("calcSummary").textContent =
    `If a fund earns about ${(returnRate * 100).toFixed(1)}% yearly and charges ${(expenseRatio * 100).toFixed(2)}% as expenses, your effective growth becomes about ${(netRate * 100).toFixed(2)}% per year.`;
}

document.getElementById("costForm").addEventListener("submit", calculateCosts);

const quizData = [
  {
    question: "Which option is mainly used to protect your family if something happens to you?",
    options: ["Term insurance", "Midcap fund", "Commodity ETF"],
    answer: 0
  },
  {
    question: "What does expense ratio mean?",
    options: ["Time you must stay invested", "Annual fee charged by a fund", "Total size of the fund house"],
    answer: 1
  },
  {
    question: "Which fund type usually invests in smaller listed companies and carries higher risk?",
    options: ["Liquid fund", "Smallcap fund", "Corporate debt fund"],
    answer: 1
  },
  {
    question: "What is an ETF?",
    options: ["A fund traded on the stock exchange", "A type of insurance rider", "A bank fixed deposit"],
    answer: 0
  }
];

function renderQuiz() {
  const quizCard = document.getElementById("quizCard");
  quizCard.innerHTML = quizData
    .map(
      (item, index) => `
        <section class="question-block" data-question-index="${index}">
          <h3>${index + 1}. ${item.question}</h3>
          <div class="option-list">
            ${item.options
              .map(
                (option, optionIndex) => `
                  <label class="option-item">
                    <input type="radio" name="question-${index}" value="${optionIndex}">
                    <span>${option}</span>
                  </label>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function checkQuiz() {
  let score = 0;

  quizData.forEach((item, index) => {
    const options = document.querySelectorAll(`input[name="question-${index}"]`);
    options.forEach((option) => {
      const container = option.closest(".option-item");
      container.classList.remove("correct", "incorrect");

      if (Number(option.value) === item.answer) {
        container.classList.add("correct");
      }

      if (option.checked && Number(option.value) !== item.answer) {
        container.classList.add("incorrect");
      }
    });

    const selected = document.querySelector(`input[name="question-${index}"]:checked`);
    if (selected && Number(selected.value) === item.answer) {
      score += 1;
    }
  });

  const quizResult = document.getElementById("quizResult");
  quizResult.textContent = `You scored ${score} out of ${quizData.length}. ${
    score === quizData.length
      ? "Excellent clarity."
      : score >= 2
        ? "You are building a solid foundation."
        : "Review the glossary once more and try again."
  }`;
}

function resetQuiz() {
  renderQuiz();
  document.getElementById("quizResult").textContent = "";
}

document.getElementById("checkQuiz").addEventListener("click", checkQuiz);
document.getElementById("resetQuiz").addEventListener("click", resetQuiz);

renderQuiz();
applyFilters();
calculateCosts(new Event("submit"));
