import { useState, useEffect } from "react";
import { toast } from "sonner";

type Operator = "+" | "-" | "×" | "÷" | null;

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: Operator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let newValue = currentValue;

      switch (operator) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "-":
          newValue = currentValue - inputValue;
          break;
        case "×":
          newValue = currentValue * inputValue;
          break;
        case "÷":
          if (inputValue === 0) {
            toast.error("Nolga bo'lib bo'lmaydi!");
            clear();
            return;
          }
          newValue = currentValue / inputValue;
          break;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key >= "0" && e.key <= "9") {
      inputDigit(e.key);
    } else if (e.key === ".") {
      inputDecimal();
    } else if (e.key === "+" || e.key === "-") {
      performOperation(e.key);
    } else if (e.key === "*") {
      performOperation("×");
    } else if (e.key === "/") {
      e.preventDefault();
      performOperation("÷");
    } else if (e.key === "Enter" || e.key === "=") {
      performOperation(null);
    } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
      clear();
    } else if (e.key === "Backspace") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, operator, previousValue, waitingForOperand]);

  const CalcButton = ({
    children,
    onClick,
    variant = "number",
    className = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "number" | "operator" | "equals" | "clear";
    className?: string;
  }) => {
    const baseClasses =
      "h-16 rounded-2xl font-medium text-lg transition-smooth active:scale-95 shadow-sm";
    const variantClasses = {
      number:
        "bg-calc-button text-calc-buttonText hover:bg-calc-buttonHover",
      operator:
        "bg-calc-operator text-calc-operatorText hover:opacity-90",
      equals:
        "bg-calc-operator text-calc-operatorText hover:opacity-90 col-span-2",
      clear:
        "bg-destructive text-destructive-foreground hover:opacity-90",
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-3xl shadow-2xl p-6 space-y-4">
          {/* Display */}
          <div className="bg-calc-display rounded-2xl p-6 min-h-[100px] flex items-end justify-end shadow-inner">
            <div className="text-calc-displayText text-5xl font-light tracking-tight break-all text-right">
              {display}
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            <CalcButton variant="clear" onClick={clear}>
              C
            </CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation("÷")}>
              ÷
            </CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation("×")}>
              ×
            </CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation("-")}>
              −
            </CalcButton>

            <CalcButton variant="number" onClick={() => inputDigit("7")}>
              7
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputDigit("8")}>
              8
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputDigit("9")}>
              9
            </CalcButton>
            <CalcButton variant="operator" onClick={() => performOperation("+")}>
              +
            </CalcButton>

            <CalcButton variant="number" onClick={() => inputDigit("4")}>
              4
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputDigit("5")}>
              5
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputDigit("6")}>
              6
            </CalcButton>
            <CalcButton
              variant="equals"
              onClick={() => performOperation(null)}
              className="row-span-2"
            >
              =
            </CalcButton>

            <CalcButton variant="number" onClick={() => inputDigit("1")}>
              1
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputDigit("2")}>
              2
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputDigit("3")}>
              3
            </CalcButton>

            <CalcButton variant="number" onClick={() => inputDigit("0")}>
              0
            </CalcButton>
            <CalcButton variant="number" onClick={() => inputDigit("00")}>
              00
            </CalcButton>
            <CalcButton variant="number" onClick={inputDecimal}>
              .
            </CalcButton>
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-muted-foreground text-sm mt-4">
          Klaviaturadan ham foydalanishingiz mumkin
        </p>
      </div>
    </div>
  );
};

export default Calculator;
