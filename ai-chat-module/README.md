# AI Chat Module

This module contains all the necessary components for the AI chat functionality, making it easily portable to other Electron applications.

## File Structure

```
ai-chat-module/
├── public/
│   └── icon.png                 # Application icon
├── src/
│   ├── components/
│   │   ├── stock/
│   │   │   └── AIChat.tsx       # Core AI chat component
│   │   └── ui/                  # UI component library
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── scroll-area.tsx
│   └── lib/
│       └── aiModel.ts           # AI model invocation methods
├── ENVIRONMENT.md               # Environment variable configuration instructions
```

## Porting Steps

1.  Copy the `ai-chat-module/src/components/stock` folder to the corresponding location in your project.
2.  Copy the UI components from the `ai-chat-module/src/components/ui` folder to the corresponding location in your project.
3.  Copy the AI model invocation methods from the `ai-chat-module/src/lib` folder to the corresponding location in your project.
4.  Copy `ai-chat-module/public/icon.png` to your project's public assets folder.
5.  Ensure your project has the following dependencies installed:
    - react
    - react-dom
    - lucide-react
    - date-fns
    - next (if using Next.js)
    - axios
    - dotenv
6.  Configure the necessary environment variables by referring to `ai-chat-module/ENVIRONMENT.md`.
7.  Create an API endpoint `/api/chat` in your project to handle AI chat requests.
8.  Import and use the `AIChat` component on the page where you want to use the AI chat functionality.

## `AIChat` Component Usage

The `AIChat` component requires two callback functions as props: `onAnalyze` and `onReset`.

### Props

-   `onAnalyze`: A function that is called when the user clicks the "Analyze" button. It receives an object with the filter values as an argument.
-   `onReset`: A function that is called when the user clicks the "Reset" button.

### Example

```jsx
import { AIChat } from "@/components/stock/AIChat";

export default function YourPage() {
  const handleAnalyze = (filters) => {
    console.log("Analyze filters:", filters);
    // Implement your analysis logic here
  };

  const handleReset = () => {
    console.log("Resetting analysis");
    // Implement your reset logic here
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2">
        <AIChat onAnalyze={handleAnalyze} onReset={handleReset} />
      </div>
    </div>
  );
}
```

## Notes

1.  The `AIChat` component uses `localStorage` to store the conversation history. Ensure that your application environment supports `localStorage`.
2.  The component calls the `/api/chat` endpoint for AI conversations. You need to implement the corresponding API in your backend.
3.  The icon file path is hardcoded in the component as `/icon.png`. If you need to change it, please update the `src` attribute in `AIChat.tsx`.
4.  The AI model invocation requires the configuration of corresponding environment variables. Please refer to the `ENVIRONMENT.md` file.
5.  Ensure that your project has the `axios` and `dotenv` dependencies installed to support AI model invocation.
