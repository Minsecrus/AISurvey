/* global Survey */

const likertColumns = [
  { value: 1, text: "非常不同意" },
  { value: 2, text: "比较不同意" },
  { value: 3, text: "一般" },
  { value: 4, text: "比较同意" },
  { value: 5, text: "非常同意" },
];

const aiTools = [
  { value: "豆包", text: "豆包" },
  { value: "DeepSeek", text: "DeepSeek" },
  { value: "Kimi", text: "Kimi" },
  { value: "通义千问", text: "通义千问" },
  { value: "文心一言", text: "文心一言" },
  { value: "ChatGPT", text: "ChatGPT" },
  { value: "Claude", text: "Claude" },
  { value: "Gemini", text: "Gemini" },
  { value: "Copilot", text: "Copilot" },
];

function matrixQuestion(name, title, items, description) {
  return {
    type: "matrix",
    name,
    title: "",
    columns: likertColumns,
    rows: items.map(({ number, text }) => ({
      value: `q${number}`,
      text: `${number}. ${text}`,
    })),
    isAllRowRequired: true,
  };
}

function choiceQuestion(name, title, choices, options = {}) {
  return {
    type: options.type || "radiogroup",
    name,
    title,
    choices,
    isRequired: options.isRequired !== false,
    ...options,
  };
}

const surveyJson = {
  locale: "zh-cn",
  showTitle: false,
  showProgressBar: "top",
  progressBarType: "pages",
  showQuestionNumbers: "off",
  showNavigationButtons: "bottom",
  completeText: "复制答案",
  requiredText: "",
  requiredError: "请完成必填题。",
  questionErrorLocation: "bottom",
  checkErrorsMode: "onValueChanged",
  clearInvisibleValues: "none",
  focusFirstQuestionAutomatic: true,
  showCompletedPage: false,
  completedHtml: "",
  triggers: [
    {
      type: "complete",
      expression: "{consent} = 'no'",
    },
  ],
  pages: [
    {
      name: "welcome",
      title: "开始之前",
      description: "请先阅读说明，并根据自己的真实情况作答。",
      elements: [
        {
          type: "html",
          name: "welcomeNote",
          html: `
            <div class="welcome-note">
              <p>亲爱的同学：</p>
              <p>您好！本问卷想了解大学生使用生成式 AI 工具时的真实体验，包括 AI 使用情况、同伴比较、学习压力，以及对高级 AI 服务的态度。</p>
              <p>问卷采用匿名形式，不收集姓名、学号等个人身份信息，所有答案只会用于整体统计分析。问卷约需 6—8 分钟完成，没有正确或错误答案。</p>
              <p class="welcome-note-emphasis">本页面没有后端提交功能。完成后，答案会在浏览器中整理为文本，你可以手动复制保存。</p>
            </div>
          `,
        },
        choiceQuestion(
          "consent",
          "是否同意参加本次调查？",
          [
            { value: "yes", text: "同意，开始填写" },
            { value: "no", text: "不同意，结束问卷" },
          ],
          { colCount: 1 }
        ),
      ],
    },
    {
      name: "basic",
      title: "第一部分 · 基本信息",
      description: "以下信息只用于分组分析，请不要填写能够识别个人身份的内容。",
      elements: [
        choiceQuestion("q1", "1. 您的性别", ["男", "女", "其他/不便回答"]),
        choiceQuestion("q2", "2. 您目前所在年级", ["大一", "大二", "大三", "大四", "大五及以上", "硕士研究生", "其他"]),
        choiceQuestion("q3", "3. 您所学专业类型", ["人文社科类", "经管类", "理工类", "信息/计算机类", "医学类", "艺术体育类", "其他"]),
        choiceQuestion("q4", "4. 您所在院校类型", ["双一流建设高校", "其他公办本科高校", "民办本科/独立学院", "高职高专院校", "其他", "不清楚"]),
        choiceQuestion("q5", "5. 您目前主要就读地区", ["东部地区", "中部地区", "西部地区", "东北地区", "港澳台及境外", "其他/不确定"]),
        choiceQuestion("q6", "6. 您每月可自由支配的生活费用大约为", ["1000元以下", "1000—1499元", "1500—1999元", "2000—2999元", "3000元及以上", "不便回答"]),
      ],
    },
    {
      name: "usage",
      title: "第二部分 · AI 实际使用情况",
      description: "这里的“生成式 AI”包括能够进行问答、写作、总结、翻译、编程等任务的 AI 工具。",
      elements: [
        choiceQuestion("q7", "7. 您是否使用过生成式 AI 工具？", ["从未使用", "偶尔使用", "经常使用"]),
        {
          type: "checkbox",
          name: "q8",
          title: "8. 您使用过哪些生成式 AI？",
          description: "可多选。若没有使用过，请选择“暂未使用任何工具”。",
          choices: [...aiTools, { value: "none", text: "暂未使用任何工具" }],
          showOtherItem: true,
          otherText: "其他工具",
          isRequired: true,
        },
        choiceQuestion("q9", "9. 您目前最常使用的 AI 是", aiTools.map((item) => item.text).concat("其他")),
        choiceQuestion("q10", "10. 您平均使用生成式 AI 的频率为", ["几乎不用", "每月1—3次", "每周1—3次", "每周4—6次", "几乎每天", "每天多次"]),
        {
          type: "checkbox",
          name: "q11",
          title: "11. 您使用 AI 主要用于哪些方面？",
          choices: ["查找或整理资料", "解释知识点", "完成课程作业", "写作或修改文章", "翻译", "编程", "数据分析", "考试复习", "总结文献", "制作 PPT", "日常生活咨询", "情感陪伴/聊天"],
          showOtherItem: true,
          otherText: "其他用途",
          isRequired: true,
        },
        choiceQuestion("q12", "12. 您目前主要使用哪类 AI 服务？", ["只使用免费 AI", "主要使用免费 AI，偶尔使用付费/高级 AI", "免费和付费 AI 均经常使用", "主要使用付费或高级 AI", "不清楚"]),
        choiceQuestion("q13", "13. 您是否曾经为生成式 AI 付费？", ["从未", "曾经付费，但目前没有", "目前正在付费使用", "使用他人账号/共享账号", "其他"]),
        choiceQuestion("q14", "14. 您每月用于 AI 工具的实际支出约为", ["0元", "1—50元", "51—100元", "101—200元", "200元以上"]),
      ],
    },
    {
      name: "peerPerception",
      title: "第三部分 · 同伴高级 AI 使用感知",
      description: "下面开始统一使用五点量表：1 = 非常不同意，5 = 非常同意。",
      elements: [
        matrixQuestion("peerPerceptionMatrix", "请判断以下说法与您的实际感受有多符合。", [
          { number: 15, text: "我身边越来越多的同学开始使用付费或高级 AI 服务。" },
          { number: 16, text: "我经常看到同学使用比我所使用的 AI 功能更强的工具。" },
          { number: 17, text: "我觉得使用高级 AI 的同学在学习中可能获得更多便利。" },
          { number: 18, text: "在我的学习环境中，熟练使用 AI 已经逐渐成为一种普遍现象。" },
          { number: 19, text: "我有时会感觉，如果不用更高级的 AI，就可能跟不上周围同学。" },
        ]),
      ],
    },
    {
      name: "socialComparison",
      title: "第四部分 · AI 使用中的社会比较",
      description: "请根据你平时的真实想法作答。",
      elements: [
        matrixQuestion("socialComparisonMatrix", "请判断以下说法与您的实际感受有多符合。", [
          { number: 20, text: "我会关注其他同学正在使用什么 AI 工具。" },
          { number: 21, text: "我会比较自己和同学所使用 AI 工具的功能或能力。" },
          { number: 22, text: "当别人使用比我更高级的 AI 时，我会在意这种差距。" },
          { number: 23, text: "看到别人通过 AI 更快完成学习任务时，我会想到自己的学习效率。" },
          { number: 24, text: "我会比较自己与同学利用 AI 完成学习任务的能力。" },
          { number: 25, text: "当很多同学都开始使用某种高级 AI 时，我也会产生尝试它的想法。" },
        ]),
      ],
    },
    {
      name: "relativeDisadvantage",
      title: "第五部分 · AI 资源相对劣势感",
      description: "这一部分关注的是：当别人拥有而自己没有时，你是否感到自己处于不利位置。",
      elements: [
        matrixQuestion("relativeDisadvantageMatrix", "请判断以下说法与您的实际感受有多符合。", [
          { number: 26, text: "当其他同学拥有更高级的 AI 工具时，我会觉得自己在学习资源上处于劣势。" },
          { number: 27, text: "如果别人可以使用收费 AI，而我只能使用免费 AI，我会产生一定的心理落差。" },
          { number: 28, text: "看到别人借助高级 AI 明显提高效率时，我有时会觉得自己“吃亏了”。" },
          { number: 29, text: "我认为不同学生获得高级 AI 资源的能力差异，可能影响学习竞争的公平性。" },
          { number: 30, text: "即使目前使用的免费 AI 已经基本够用，我看到别人拥有更好的 AI 时仍可能感到落差。" },
        ]),
      ],
    },
    {
      name: "learningAnxiety",
      title: "第六部分 · 学习焦虑与竞争压力",
      description: "",
      elements: [
        matrixQuestion("learningAnxietyMatrix", "请判断以下说法与您的实际感受有多符合。", [
          { number: 31, text: "我担心不会使用高级 AI 会降低自己的学习竞争力。" },
          { number: 32, text: "看到其他同学熟练使用 AI 时，我有时会感到压力。" },
          { number: 33, text: "我担心 AI 技术快速发展会让自己逐渐跟不上。" },
          { number: 34, text: "如果周围同学都开始使用高级 AI，我会担心自己落后。" },
          { number: 35, text: "我有时会因为不知道如何充分利用 AI 而产生焦虑。" },
          { number: 36, text: "我担心其他学生借助 AI 获得远高于自己的学习效率。" },
        ]),
      ],
    },
    {
      name: "selfEfficacy",
      title: "第七部分 · 学习自我效能感",
      description: "请判断以下说法与您的实际感受有多符合。",
      elements: [
        matrixQuestion("selfEfficacyMatrix", "请判断以下说法与您的实际感受有多符合。", [
          { number: 37, text: "即使没有高级 AI，我也有信心完成大部分学习任务。" },
          { number: 38, text: "即使其他同学拥有更高级的 AI，我仍相信自己能够学好课程内容。" },
          { number: 39, text: "我认为自己的学习能力比使用哪一种 AI 更加重要。" },
          { number: 40, text: "当 AI 无法使用时，我仍然能够独立解决大多数学习问题。" },
          { number: 41, text: "使用 AI 后，我对自己解决复杂学习任务的能力更有信心。" },
        ]),
      ],
    },
    {
      name: "dependence",
      title: "第八部分 · AI 依赖与自主学习",
      description: "其中部分题目关注 AI 依赖，部分题目关注自主学习行为，请分别按直觉回答。",
      elements: [
        matrixQuestion("dependenceMatrix", "请判断以下说法与您的实际情况有多符合。", [
          { number: 42, text: "遇到不会的问题时，我现在的第一反应通常是询问 AI。" },
          { number: 43, text: "如果学习过程中完全不能使用 AI，我会觉得很不方便。" },
          { number: 44, text: "如果长时间无法使用 AI，我可能会担心自己的学习效率下降。" },
          { number: 45, text: "即使 AI 已经给出了答案，我通常仍会自己思考其中的原因。" },
          { number: 46, text: "我通常会检查 AI 给出的信息是否可靠。" },
          { number: 47, text: "我会尝试先独立解决问题，再使用 AI 进行辅助。" },
          { number: 48, text: "我担心过度使用 AI 会削弱自己的独立思考能力。" },
        ]),
      ],
    },
    {
      name: "aiLiteracy",
      title: "第九部分 · AI 素养",
      description: "请判断以下说法与您的实际能力有多符合。",
      elements: [
        matrixQuestion("aiLiteracyMatrix", "请判断以下说法与您的实际情况有多符合。", [
          { number: 49, text: "我能够判断不同 AI 工具分别适合完成哪些任务。" },
          { number: 50, text: "我了解生成式 AI 可能产生错误或虚假信息。" },
          { number: 51, text: "我能够对 AI 给出的回答进行基本判断和核实。" },
          { number: 52, text: "我能够根据任务需要选择合适的 AI 工具，而不是盲目追求高级版本。" },
          { number: 53, text: "我不会仅仅因为某种 AI 收费，就认为它一定比免费 AI 更好。" },
          { number: 54, text: "我能够较理性地判断自己是否真的需要购买高级 AI 服务。" },
        ]),
      ],
    },
    {
      name: "willingness",
      title: "第十部分 · 高级 AI 付费意愿",
      description: "请判断以下情境是否会影响你购买高级 AI 的意愿。",
      elements: [
        matrixQuestion("willingnessMatrix", "请判断以下说法与您的实际意愿有多符合。", [
          { number: 55, text: "如果高级 AI 能够明显提高学习效率，我愿意为它付费。" },
          { number: 56, text: "如果高级 AI 能够明显提高学习质量，我愿意为它付费。" },
          { number: 57, text: "如果身边很多同学都开始使用高级 AI，我购买高级 AI 的意愿会增加。" },
          { number: 58, text: "如果我认为不用高级 AI 会在学习中落后，我更可能选择付费。" },
          { number: 59, text: "即使免费 AI 基本能满足需要，看到周围同学使用高级 AI 也可能促使我购买。" },
          { number: 60, text: "如果周围同学都没有使用高级 AI，我购买它的意愿可能会降低。" },
        ]),
      ],
    },
    {
      name: "scenario",
      title: "第十一部分 · 情境题",
      description: "请先阅读下面的场景，再回答后续问题。",
      elements: [
        {
          type: "html",
          name: "scenarioNote",
          html: `
            <div class="scenario-note">
              <div class="scenario-label">想象一下</div>
              <p>假设你正在准备一项重要课程作业。你发现班级中不少同学已经开始使用功能更强的付费 AI 工具，他们表示这些工具可以提供更深入的分析、更长的上下文和更高质量的答案。而你目前主要使用免费 AI。</p>
            </div>
          `,
        },
        matrixQuestion("scenarioMatrix", "在这种情况下，请判断以下说法与您的感受有多符合。", [
          { number: 61, text: "我会担心自己的作业质量不如其他同学。" },
          { number: 62, text: "我会觉得自己在学习工具方面处于劣势。" },
          { number: 63, text: "我会产生购买高级 AI 的想法。" },
          { number: 64, text: "即使自己的免费 AI 暂时够用，我仍可能想升级到高级 AI。" },
          { number: 65, text: "我会首先了解高级 AI 是否真的适合自己的需求，而不是直接购买。" },
        ]),
      ],
    },
    {
      name: "openQuestions",
      title: "第十二部分 · 开放题",
      description: "没有标准答案，写下你真正的想法即可；不想回答的题目可以留空。",
      elements: [
        {
          type: "comment",
          name: "q66",
          title: "66. 当你发现其他同学正在使用比你更高级或更昂贵的 AI 工具时，你通常会有什么想法或感受？",
          isRequired: false,
          placeholder: "可以写下一个具体的瞬间、想法或感受……",
          rows: 4,
        },
        {
          type: "comment",
          name: "q67",
          title: "67. 你认为 AI 工具之间的差异，会不会影响大学生之间的学习竞争？为什么？",
          isRequired: false,
          placeholder: "欢迎结合自己的学习经历回答……",
          rows: 4,
        },
        {
          type: "comment",
          name: "q68",
          title: "68. 你觉得自己购买高级 AI 最可能是因为什么？",
          isRequired: false,
          placeholder: "例如功能、效率、同伴影响、价格或其他原因……",
          rows: 4,
        },
      ],
    },
  ],
};

const answerSectionByElementName = new Map();
const flattenedElements = surveyJson.pages.flatMap((page) => {
  page.elements.forEach((element) => {
    answerSectionByElementName.set(element.name, page.title || page.name);
  });
  return page.elements;
});

surveyJson.pages = [{
  name: "survey",
  title: "",
  elements: flattenedElements,
}];

function getChoiceText(question, value) {
  if (value === undefined || value === null || value === "") {
    return "未填写";
  }

  const choices = question.choices || [];
  const matchedChoice = choices.find((choice) => {
    const choiceValue = typeof choice === "object" ? choice.value : choice;
    return String(choiceValue) === String(value);
  });

  if (matchedChoice) {
    return typeof matchedChoice === "object" ? matchedChoice.text : matchedChoice;
  }

  const column = (question.columns || []).find((item) => String(item.value) === String(value));
  return column ? column.text : String(value);
}

function formatQuestionAnswer(question, data) {
  if (question.getType && question.getType() === "matrix") {
    const matrixAnswer = data[question.name] || {};
    return (question.rows || []).map((row) => {
      const value = matrixAnswer[row.value];
      return `${row.text}：${getChoiceText(question, value)}`;
    });
  }

  const rawValue = data[question.name];
  if (Array.isArray(rawValue)) {
    const values = rawValue.map((value) => getChoiceText(question, value));
    const otherComment = data[`${question.name}-Comment`] || data[`${question.name}-other`];
    if (otherComment) {
      values.push(`其他：${otherComment}`);
    }
    return values.length ? values.join("、") : "未填写";
  }

  const answer = getChoiceText(question, rawValue);
  const otherComment = data[`${question.name}-Comment`] || data[`${question.name}-other`];
  if (otherComment && answer !== "未填写") {
    return `${answer}（${otherComment}）`;
  }
  return answer;
}

function buildAnswerText(survey) {
  const lines = [
    "【大学生生成式 AI 使用、社会比较与学习心理调查问卷】",
    `提交时间：${new Intl.DateTimeFormat("zh-CN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date())}`,
    "",
  ];

  let currentSection = "";
  survey.pages.forEach((page) => {
    page.elements.forEach((element) => {
      if (element.type === "html") {
        return;
      }

      const section = answerSectionByElementName.get(element.name);
      if (section && section !== currentSection) {
        lines.push(`【${section}】`);
        currentSection = section;
      }

      const question = survey.getQuestionByName(element.name);
      if (!question) {
        return;
      }

      const answerLines = formatQuestionAnswer(question, survey.data);
      if (Array.isArray(answerLines)) {
        lines.push(...answerLines);
      } else {
        lines.push(`${question.title}：${answerLines}`);
      }
    });

  });

  return lines.join("\n").trim();
}

function enhanceMatrixQuestion(questionElement, question) {
  const nativeTable = questionElement.querySelector(".sd-matrix__table");
  if (!nativeTable || questionElement.querySelector(".matrix-custom-layout")) {
    return;
  }

  const customLayout = document.createElement("div");
  customLayout.className = "matrix-custom-layout";

  Array.from(nativeTable.querySelectorAll("tbody tr")).forEach((nativeRow, rowIndex) => {
    const inputs = Array.from(nativeRow.querySelectorAll("input[type='radio']"));
    if (!inputs.length) {
      return;
    }

    const row = question.rows[rowIndex];
    const rowLabel = row?.text
      || nativeRow.querySelector(".sd-matrix__cell--row-text")?.textContent.trim()
      || `第${rowIndex + 1}行`;
    const customRow = document.createElement("div");
    customRow.className = "matrix-custom-row";

    const stem = document.createElement("div");
    stem.className = "matrix-custom-stem";
    stem.textContent = rowLabel;

    const options = document.createElement("div");
    options.className = "matrix-custom-options";
    options.setAttribute("role", "group");
    options.setAttribute("aria-label", rowLabel);

    const buttonBindings = [];
    const syncSelection = () => {
      buttonBindings.forEach(({ button, input }) => {
        const selected = input.checked;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    };

    inputs.forEach((input, columnIndex) => {
      const column = question.columns[columnIndex];
      const columnLabel = column?.text || `选项${columnIndex + 1}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `matrix-custom-choice matrix-choice-${columnIndex}`;
      button.textContent = columnLabel;
      button.setAttribute("aria-label", `${rowLabel}：${columnLabel}`);
      button.setAttribute("aria-pressed", "false");
      input.tabIndex = -1;

      button.addEventListener("click", () => {
        input.click();
        syncSelection();
      });
      input.addEventListener("change", syncSelection);

      buttonBindings.push({ button, input });
      options.append(button);
    });

    syncSelection();
    customRow.append(stem, options);
    customLayout.append(customRow);
  });

  if (!customLayout.children.length) {
    return;
  }

  nativeTable.classList.add("matrix-native-table");
  nativeTable.setAttribute("aria-hidden", "true");
  nativeTable.insertAdjacentElement("afterend", customLayout);
}

function enhanceSelectBaseQuestion(questionElement) {
  const items = questionElement.querySelectorAll(".sd-selectbase__item");

  items.forEach((item) => {
    const input = item.querySelector("input[type='radio'], input[type='checkbox']");
    if (!input || item.dataset.selectEnhanced === "true") {
      return;
    }

    const syncSelection = () => {
      const selected = input.checked;
      item.classList.toggle("survey-choice-selected", selected);

      const textElements = item.querySelectorAll(
        ".sd-item__control-label, .sd-item__control-label *, .sd-item__text, .sd-item__text *, .sv-string-viewer"
      );
      textElements.forEach((element) => {
        if (selected) {
          element.style.setProperty("color", "#fff", "important");
        } else {
          element.style.removeProperty("color");
        }
      });
    };

    item.dataset.selectEnhanced = "true";
    input.addEventListener("change", syncSelection);
    syncSelection();
    item.addEventListener("click", (event) => {
      if (event.target === input) {
        return;
      }

      event.preventDefault();
      input.click();
    });
  });
}

function fallbackCopy(text) {
  const temporary = document.createElement("textarea");
  temporary.value = text;
  temporary.setAttribute("readonly", "");
  temporary.style.position = "fixed";
  temporary.style.opacity = "0";
  document.body.appendChild(temporary);
  temporary.select();
  const copied = document.execCommand("copy");
  temporary.remove();
  return copied;
}

async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    return fallbackCopy(text);
  } catch (error) {
    try {
      return fallbackCopy(text);
    } catch (fallbackError) {
      return false;
    }
  }
}

function setCopyStatus(copyStatus, copied) {
  copyStatus.hidden = false;
  copyStatus.textContent = copied
    ? "答案已复制到剪贴板"
    : "复制失败，请再次点击“复制答案”";
  copyStatus.style.color = copied ? "var(--teal)" : "#b35c45";
}

function initialiseSurvey() {
  const survey = new Survey.Model(surveyJson);
  const surveyContainer = document.getElementById("surveyContainer");
  const copyStatus = document.getElementById("copyStatus");

  survey.onAfterRenderQuestion.add((sender, options) => {
    if (options.question.getType() === "matrix") {
      enhanceMatrixQuestion(options.htmlElement, options.question);
    } else {
      enhanceSelectBaseQuestion(options.htmlElement);
    }
  });

  survey.onComplete.add(async (sender) => {
    if (sender.data.consent !== "yes") {
      return;
    }

    setCopyStatus(copyStatus, await copyTextToClipboard(buildAnswerText(sender)));
  });

  survey.render(surveyContainer);
  const actionBar = surveyContainer.querySelector(".sd-action-bar, .sd-navigation");
  if (actionBar) {
    actionBar.append(copyStatus);
  }
}

document.addEventListener("DOMContentLoaded", initialiseSurvey);
