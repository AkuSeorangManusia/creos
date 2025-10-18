"use client";

import { useState } from "react";

export function AboutMe() {
  return (
    <div className="p-2">
      <h2 className="text-3xl text-black font-bold mb-4">About Me</h2>
      <div className="mb-4">
        <img
          src="/lilith.png"
          alt="my kisah"
          className="w-30 h-30 float-left mr-4 mb-2"
        />
        <div className="text-black leading-none">
          <p>
            Hello! I'm <strong>Muhammad Ahsan Sanadi</strong>, somewhat a tech
            enthusiast from Yogyakarta, Indonesia.
          </p>
          <p className="mt-2">
            I don't really have any particular interest in one specific field of
            IT. If something interests me, I will probably try it at 2 AM.
          </p>
        </div>
      </div>
      <div className="flex-none text-black leading-none clear-left">
        <p>Some quick facts about me:</p>
        <ul className="list-disc list-inside">
          <li>Proud ThinkPad user</li>
          <li>I used Arch before</li>
          <li>I love Linux</li>
          <li>
            Although I did say no particular interest, I do want to be a good
            DevOps engineer someday
          </li>
          <li>I'm good in English I think</li>
          <li>I believe Lilith exist</li>
        </ul>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <div className="p-2">
      <div className="flex">
        <img src="/Cake.png" alt="cake" className="w-32 mb-2 flex-none" />
        <div className="ml-4">
          <h2 className="text-3xl text-black font-bold flex-none">Projects</h2>
          <p className="text-gray-600 mb-4 leading-none">
            Some of my random creations and things I participated in
          </p>
        </div>
      </div>
      <div className="space-y-6 mt-5">
        <div
          className="border-l-4 border-blue-500 hover:border-4 pl-4"
          onClick={() => window.open("https://handybox.andimsum.icu", "_blank")}
          style={{ cursor: "pointer" }}
        >
          <h3 className="font-bold text-black text-xl">HandyBox</h3>
          <p className="text-gray-600 mt-1 text-lg">
            A website that serves various kind of handy calculating tools.
            Deprecated, although I might revive it in the future.
          </p>
        </div>
        <div
          className="border-l-4 border-green-500 hover:border-4 pl-4"
          onClick={() =>
            window.open("https://handybox.andimsum.icu/ReminderBuddy", "_blank")
          }
          style={{ cursor: "pointer" }}
        >
          <h3 className="font-bold text-black text-xl">ReminderBuddy</h3>
          <p className="text-gray-600 mt-1 text-lg">
            Telegram bot that is supposed to help you set reminders and
            schedules. I made this merely for school assignment. Deprecated.
          </p>
        </div>
        <div
          className="border-l-4 border-pink-500 hover:border-4 pl-4"
          onClick={() => window.open("https://snaplove.pics/", "_blank")}
          style={{ cursor: "pointer" }}
        >
          <h3 className="font-bold text-black text-xl">SnapLove (Slaviors)</h3>
          <p className="text-gray-600 mt-1 text-lg">
            An SaaS website that serves digital photobooth.
          </p>
        </div>
        <div
          className="border-l-4 border-purple-500 hover:border-4 pl-4"
          onClick={() => window.open("https://andimsum.icu", "_self")}
          style={{ cursor: "pointer" }}
        >
          <h3 className="font-bold text-black text-xl">This Website</h3>
          <p className="text-gray-600 mt-1 text-lg">
            If you click this, the site might reload idk
          </p>
        </div>
      </div>
    </div>
  );
}

export function Contacts() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("andimsum_");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="p-2">
      <div className="flex">
        <div className="ml-4">
          <h2 className="text-3xl text-black font-bold flex-none">Contacts</h2>
          <p className="text-gray-600 mb-4 mr-4 leading-none">
            Contact me and say hi maybe
          </p>
          <div className="space-y-4 text-black text-lg">
            <div className="space-y-3">
              {/* Email */}
              <div
                className="flex items-center gap-3 pb-2 hover:cursor-pointer"
                onClick={handleCopy}
              >
                <img src="/email-icon-99.png" alt="Email" className="w-8" />
                <div className="leading-none">
                  <strong>Email</strong>
                  <br />
                  <span className="text-blue-600">
                    ahsansanadi167@gmail.com
                  </span>
                  <br />
                  {copied && <span className="text-green-600">Copied!</span>}
                </div>
              </div>

              {/* LinkedIn */}
              <div
                className="flex items-center gap-3 pb-2 hover:cursor-pointer"
                onClick={() =>
                  window.open("https://www.linkedin.com/in/andimsum/", "_blank")
                }
              >
                <img
                  src="/LinkedIn-Emblema.png"
                  alt="LinkedIn"
                  className="w-8"
                />
                <div className="leading-none">
                  <strong>LinkedIn</strong>
                  <br />
                  <span className="text-blue-600">
                    linkedin.com/in/andimsum/
                  </span>
                </div>
              </div>

              {/* GitHub */}
              <div
                className="flex items-center gap-3 pb-2 hover:cursor-pointer"
                onClick={() =>
                  window.open("https://github.com/AkuSeorangManusia", "_blank")
                }
              >
                <img src="github-icon.png" alt="GitHub" className="w-8" />
                <div className="leading-none">
                  <strong>GitHub</strong>
                  <br />
                  <span className="text-blue-600">
                    github.com/AkuSeorangManusia/
                  </span>
                </div>
              </div>

              {/* Instagram */}
              <div
                className="flex items-center gap-3 pb-2 hover:cursor-pointer"
                onClick={() =>
                  window.open("https://www.instagram.com/andimsum_", "_blank")
                }
              >
                <img src="instagram-icon.png" alt="Instagram" className="w-8" />
                <div className="leading-none">
                  <strong>Instagram</strong>
                  <br />
                  <span className="text-blue-600">instagram.com/andimsum_</span>
                </div>
              </div>

              {/* Discord */}
              <div
                className="flex items-center gap-3 pb-2 hover:cursor-pointer"
                onClick={handleCopy}
              >
                <img
                  src="discord-icon.jpg"
                  alt="Discord"
                  className="w-8 rounded"
                />
                <div className="leading-none">
                  <strong>Discord</strong>
                  <br />
                  <span className="text-blue-600">andimsum_</span>
                  <br />
                  {copied && <span className="text-green-600">Copied!</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          src="/address-me.jpg"
          alt="address me"
          className="w-32 mb-2 flex-none ml-auto self-start"
        />
      </div>
    </div>
  );
}

export function Guestbook() {
  return (
    <div className="w-full h-full flex flex-col">
      <iframe
        src="https://andimsum.atabook.org"
        className="w-full h-full border-0"
        title="Guestbook"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
}

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(equation + display + " " + op + " ");
    setIsNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setIsNewNumber(false);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
      setIsNewNumber(true);
    }
  };

  const handleEquals = () => {
    try {
      const fullEquation = equation + display;
      // Replace × and ÷ with * and / for evaluation
      const evalString = fullEquation.replace(/×/g, "*").replace(/÷/g, "/");
      const result = eval(evalString);
      setDisplay(String(result));
      setEquation(fullEquation + " =");
      setIsNewNumber(true);
    } catch (error) {
      setDisplay("Error");
      setEquation("");
      setIsNewNumber(true);
    }
  };

  const handleParenthesis = (paren) => {
    if (isNewNumber) {
      setDisplay(paren);
      setIsNewNumber(false);
    } else {
      setDisplay(display + paren);
    }
  };

  const Button = ({ label, onClick, className = "", span = false }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      className={`bg-gray-100 hover:bg-gray-200 border-2 border-gray-400 text-black font-bold text-xl 
        ${span ? "col-span-2" : ""} 
        ${className}`}
      style={{ height: "60px", cursor: "pointer" }}
    >
      {label}
    </button>
  );

  return (
    <div 
      className="w-full h-full bg-white p-4 flex flex-col"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{ cursor: "default" }}
    >
      {/* Display */}
      <div className="bg-gray-50 border-2 border-gray-400 p-3 mb-4 text-right">
        <div className="text-sm text-gray-600 h-5 overflow-hidden">
          {equation}
        </div>
        <div className="text-3xl font-bold text-black mt-1 break-all">
          {display}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {/* Row 1: Clear, Backspace, Parentheses, Divide */}
        <Button
          label="C"
          onClick={handleClear}
          className="bg-red-100 hover:bg-red-200"
        />
        <Button
          label="⌫"
          onClick={handleBackspace}
          className="bg-red-100 hover:bg-red-200"
        />
        <Button label="(" onClick={() => handleParenthesis("(")} />
        <Button label=")" onClick={() => handleParenthesis(")")} />

        {/* Row 2: 7, 8, 9, Multiply */}
        <Button label="7" onClick={() => handleNumber("7")} />
        <Button label="8" onClick={() => handleNumber("8")} />
        <Button label="9" onClick={() => handleNumber("9")} />
        <Button
          label="÷"
          onClick={() => handleOperator("÷")}
          className="bg-blue-100 hover:bg-blue-200"
        />

        {/* Row 3: 4, 5, 6, Multiply */}
        <Button label="4" onClick={() => handleNumber("4")} />
        <Button label="5" onClick={() => handleNumber("5")} />
        <Button label="6" onClick={() => handleNumber("6")} />
        <Button
          label="×"
          onClick={() => handleOperator("×")}
          className="bg-blue-100 hover:bg-blue-200"
        />

        {/* Row 4: 1, 2, 3, Subtract */}
        <Button label="1" onClick={() => handleNumber("1")} />
        <Button label="2" onClick={() => handleNumber("2")} />
        <Button label="3" onClick={() => handleNumber("3")} />
        <Button
          label="-"
          onClick={() => handleOperator("-")}
          className="bg-blue-100 hover:bg-blue-200"
        />

        {/* Row 5: 0 (span 2), Decimal, Add */}
        <Button label="0" onClick={() => handleNumber("0")} span={true} />
        <Button label="." onClick={handleDecimal} />
        <Button
          label="+"
          onClick={() => handleOperator("+")}
          className="bg-blue-100 hover:bg-blue-200"
        />

        {/* Row 6: Equals (span 4) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEquals();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className="col-span-4 bg-green-100 hover:bg-green-200 border-2 border-gray-400 text-black font-bold text-xl"
          style={{ height: "60px", cursor: "pointer" }}
        >
          =
        </button>
      </div>
    </div>
  );
}
