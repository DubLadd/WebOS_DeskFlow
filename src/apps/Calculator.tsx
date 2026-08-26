import React, { useState } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { Minus, Plus, X, Divide, RotateCcw, Equal } from 'lucide-react';

export const Calculator: React.FC<{ window: WindowState }> = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const toggleSign = () => {
    setDisplay(display.charAt(0) === '-' ? display.substr(1) : '-' + display);
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);

      setPrevValue(newValue);
      setDisplay(newValue.toString());
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, current: number, op: string) => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '*': return prev * current;
      case '/': return prev / current;
      default: return current;
    }
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);

    if (operator && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operator);
      setDisplay(result.toString());
      setPrevValue(null);
      setOperator(null);
      setWaitingForSecondOperand(true);
    }
  };

  const Button = ({ children, onClick, variant = 'default', className = '' }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "h-14 w-14 flex items-center justify-center rounded-2xl text-lg font-semibold transition-all duration-200 active:scale-90",
        variant === 'default' ? "bg-white/5 hover:bg-white/10 text-foreground" : "",
        variant === 'operator' ? "bg-primary/20 hover:bg-primary/30 text-primary" : "",
        variant === 'action' ? "bg-white/10 hover:bg-white/20 text-foreground/70" : "",
        variant === 'equal' ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(13,162,231,0.5)]" : "",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-secondary/30 rounded-b-xl overflow-hidden p-6 backdrop-blur-md">
      {/* Display */}
      <div className="flex-1 flex flex-col justify-end items-end mb-6">
        <div className="text-xs font-medium opacity-40 mb-1">
          {prevValue !== null ? `${prevValue} ${operator || ''}` : ''}
        </div>
        <div className="text-4xl font-bold tracking-tight truncate w-full text-right">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3">
        <Button variant="action" onClick={clear}>AC</Button>
        <Button variant="action" onClick={toggleSign}>+/-</Button>
        <Button variant="action" onClick={inputPercent}>%</Button>
        <Button variant="operator" onClick={() => performOperation('/')}><Divide size={20} /></Button>

        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button variant="operator" onClick={() => performOperation('*')}><X size={20} /></Button>

        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <Button variant="operator" onClick={() => performOperation('-')}><Minus size={20} /></Button>

        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button variant="operator" onClick={() => performOperation('+')}><Plus size={20} /></Button>

        <Button onClick={() => inputDigit('0')} className="col-span-1">0</Button>
        <Button onClick={inputDot}>.</Button>
        <Button variant="action" onClick={clear}><RotateCcw size={20} /></Button>
        <Button variant="equal" onClick={handleEqual}><Equal size={20} /></Button>
      </div>
    </div>
  );
};
