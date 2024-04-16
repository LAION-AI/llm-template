import { useState } from "preact/hooks";
import SimpleMathTemplate from "./SimpleMathTemplate.tsx";

function parseJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

export default function TemplateWrapper() {
  const [configExamples, setConfigExamples] = useState(JSON.stringify(
    [
      [5, "+", "INPUT", "=", 10, "FEEDBACK"],
      [20, "-", "INPUT", "=", 2, "FEEDBACK"],
      [20, "-", "INPUT", "=", "INPUT", "FEEDBACK"],
      ["INPUT", "+", 4, "=", 8, "FEEDBACK"],
    ],
    null,
    4,
  ));

  const [layout, setLayout] = useState(JSON.stringify(
    {
      "wrapperClass": "flex flex-col",
      "rowClass": "flex gap-2 mb-2",
      "itemClass": "w-12 h-12 flex items-center justify-center",
      "feedback": {
        true: "✅",
        false: "❌",
      },
      "elements": [
        {
          "element": "div",
          "cssClass": "bg-blue-200 p-4 rounded-lg",
        },
        {
          "element": "input",
          "cssClass": "rounded-lg p-2 w-12",
        },
        {
          "element": "submit",
          "cssClass":
            "bg-blue-400 w-full flex items-center justify-center rounded-lg py-2 hover:bg-blue-600 text-white font-bold",
        },
      ],
    },
    null,
    4,
  ));

  return (
    <div class="flex w-full h-full">
      <div class="w-1/2">
        <div class="h-1/2 p-4">
          <textarea
            class="w-full h-full"
            placeholder="Type config comes here"
            value={layout}
            onInput={(e) => setLayout(e.target.value)}
          >
          </textarea>
        </div>
        <div class="h-1/2 p-4">
          <textarea
            class="w-full h-full"
            placeholder="Type config comes here"
            value={configExamples}
            onInput={(e) => setConfigExamples(e.target.value)}
          >
          </textarea>
        </div>
      </div>
      <div class="w-1/2 h-full flex justify-center items-center">
        <SimpleMathTemplate
          config={parseJson(layout)}
          configInput={parseJson(configExamples)}
        />
      </div>
    </div>
  );
}
