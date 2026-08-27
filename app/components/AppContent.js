"use client";

import parse from "html-react-parser";
import Image from "next/image";
import { useEffect, useState } from "react";

const isOperator = (token) => ["+", "-", "*", "/"].includes(token);
const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };

function evaluateExpression(expression) {
    const normalized = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\s+/g, "");
    const rawTokens = normalized.match(/(\d+\.?\d*|\.\d+|[()+\-*/])/g);

    if (!rawTokens || rawTokens.join("") !== normalized) {
        throw new Error("Invalid expression");
    }

    const tokens = [];
    for (let i = 0; i < rawTokens.length; i += 1) {
        const token = rawTokens[i];
        const prev = rawTokens[i - 1];
        const next = rawTokens[i + 1];

        if (
            token === "-" &&
            (i === 0 || isOperator(prev) || prev === "(") &&
            next &&
            !Number.isNaN(Number(next))
        ) {
            tokens.push(String(-Number(next)));
            i += 1;
            continue;
        }

        tokens.push(token);
    }

    const output = [];
    const operators = [];

    tokens.forEach((token) => {
        if (!Number.isNaN(Number(token))) {
            output.push(token);
            return;
        }

        if (isOperator(token)) {
            while (
                operators.length > 0 &&
                isOperator(operators[operators.length - 1]) &&
                precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
                output.push(operators.pop());
            }
            operators.push(token);
            return;
        }

        if (token === "(") {
            operators.push(token);
            return;
        }

        if (token === ")") {
            while (
                operators.length > 0 &&
                operators[operators.length - 1] !== "("
            ) {
                output.push(operators.pop());
            }

            if (operators.pop() !== "(") {
                throw new Error("Mismatched parentheses");
            }
        }
    });

    while (operators.length > 0) {
        const op = operators.pop();
        if (op === "(" || op === ")") {
            throw new Error("Mismatched parentheses");
        }
        output.push(op);
    }

    const stack = [];
    output.forEach((token) => {
        if (!Number.isNaN(Number(token))) {
            stack.push(Number(token));
            return;
        }

        const b = stack.pop();
        const a = stack.pop();
        if (typeof a !== "number" || typeof b !== "number") {
            throw new Error("Invalid expression");
        }

        switch (token) {
            case "+":
                stack.push(a + b);
                break;
            case "-":
                stack.push(a - b);
                break;
            case "*":
                stack.push(a * b);
                break;
            case "/":
                if (b === 0) {
                    throw new Error("Division by zero");
                }
                stack.push(a / b);
                break;
            default:
                throw new Error("Unknown operator");
        }
    });

    if (stack.length !== 1 || !Number.isFinite(stack[0])) {
        throw new Error("Invalid result");
    }

    return parseFloat(stack[0].toFixed(10)).toString();
}

export function AboutMe() {
    return (
        <div className="p-2">
            <h2 className="text-3xl text-black font-bold mb-4">About Me</h2>
            <div className="mb-4">
                <Image
                    src="/lilith.png"
                    alt="my kisah"
                    width={120}
                    height={120}
                    className="w-30 h-30 float-left mr-4 mb-2"
                />
                <div className="text-black leading-none">
                    <p>
                        Hello! I'm <strong>Muhammad Ahsan Sanadi</strong>,
                        somewhat a tech enthusiast from Yogyakarta, Indonesia.
                    </p>
                    <p className="mt-2">
                        I don't really have any particular interest in one
                        specific field of IT. If something takes my interest, I
                        will probably try it at 2 AM.
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
                        Although I did say no particular interest, I do want to
                        be a good DevOps engineer someday
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
                <Image
                    src="/Cake.png"
                    alt="cake"
                    width={128}
                    height={128}
                    className="w-32 mb-2 flex-none"
                />
                <div className="ml-4">
                    <h2 className="text-3xl text-black font-bold flex-none">
                        Projects
                    </h2>
                    <p className="text-gray-600 mb-4 leading-none">
                        Some of my random creations and things I participated in
                    </p>
                </div>
            </div>
            <div className="space-y-6 mt-5">
                <button
                    type="button"
                    onClick={() =>
                        window.open(
                            "https://handybox.ahsansanadi.site",
                            "_blank",
                        )
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                    className="border-l-4 border-blue-500 hover:border-4 pl-4 text-left w-full bg-transparent border-0"
                    style={{ cursor: "pointer" }}
                >
                    <h3 className="font-bold text-black text-xl">HandyBox</h3>
                    <p className="text-gray-600 mt-1 text-lg">
                        A website that serves various kind of handy calculating
                        tools. Deprecated, although I might revive it in the
                        future. <br />
                        UPDATE: i revived it with vue yay
                    </p>
                </button>
                <button
                    type="button"
                    className="border-l-4 border-green-500 hover:border-4 pl-4 text-left w-full bg-transparent border-0"
                    onClick={() =>
                        window.open(
                            "https://handybox.andimsum.icu/ReminderBuddy",
                            "_blank",
                        )
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ cursor: "pointer" }}
                >
                    <h3 className="font-bold text-black text-xl">
                        ReminderBuddy
                    </h3>
                    <p className="text-gray-600 mt-1 text-lg">
                        Telegram bot that is supposed to help you set reminders
                        and schedules. I made this merely for school assignment.
                        Deprecated.
                    </p>
                </button>
                <button
                    type="button"
                    className="border-l-4 border-pink-500 hover:border-4 pl-4 text-left w-full bg-transparent border-0"
                    onClick={() =>
                        window.open("https://snaplove.pics/", "_blank")
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ cursor: "pointer" }}
                >
                    <h3 className="font-bold text-black text-xl">
                        SnapLove (Slaviors)
                    </h3>
                    <p className="text-gray-600 mt-1 text-lg">
                        An SaaS website that serves digital photobooth.
                    </p>
                </button>
                <button
                    type="button"
                    className="border-l-4 border-purple-500 hover:border-4 pl-4 text-left w-full bg-transparent border-0"
                    onClick={() =>
                        window.open("https://ahsansanadi.site", "_self")
                    }
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{ cursor: "pointer" }}
                >
                    <h3 className="font-bold text-black text-xl">
                        This Website
                    </h3>
                    <p className="text-gray-600 mt-1 text-lg">
                        If you click this, the site might reload idk
                    </p>
                </button>
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
                    <h2 className="text-3xl text-black font-bold flex-none">
                        Contacts
                    </h2>
                    <p className="text-gray-600 mb-4 mr-4 leading-none">
                        Contact me and say hi maybe
                    </p>
                    <div className="space-y-4 text-black text-lg">
                        <div className="space-y-3">
                            {/* Email */}
                            <button
                                type="button"
                                className="flex items-center gap-3 pb-2 hover:cursor-pointer bg-transparent border-0 p-0 text-left"
                                onClick={handleCopy}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src="/email-icon-99.png"
                                    alt="Email"
                                    width={32}
                                    height={32}
                                    className="w-8"
                                />
                                <div className="leading-none">
                                    <strong>Email</strong>
                                    <br />
                                    <span className="text-blue-600">
                                        ahsansanadi167@gmail.com
                                    </span>
                                    <br />
                                    {copied && (
                                        <span className="text-green-600">
                                            Copied!
                                        </span>
                                    )}
                                </div>
                            </button>

                            {/* LinkedIn */}
                            <button
                                type="button"
                                className="flex items-center gap-3 pb-2 hover:cursor-pointer bg-transparent border-0 p-0 text-left"
                                onClick={() =>
                                    window.open(
                                        "https://www.linkedin.com/in/andimsum/",
                                        "_blank",
                                    )
                                }
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src="/LinkedIn-Emblema.png"
                                    alt="LinkedIn"
                                    width={32}
                                    height={32}
                                    className="w-8"
                                />
                                <div className="leading-none">
                                    <strong>LinkedIn</strong>
                                    <br />
                                    <span className="text-blue-600">
                                        linkedin.com/in/andimsum/
                                    </span>
                                </div>
                            </button>

                            {/* GitHub */}
                            <button
                                type="button"
                                className="flex items-center gap-3 pb-2 hover:cursor-pointer bg-transparent border-0 p-0 text-left"
                                onClick={() =>
                                    window.open(
                                        "https://github.com/AkuSeorangManusia",
                                        "_blank",
                                    )
                                }
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src="/github-icon.png"
                                    alt="GitHub"
                                    width={32}
                                    height={32}
                                    className="w-8"
                                />
                                <div className="leading-none">
                                    <strong>GitHub</strong>
                                    <br />
                                    <span className="text-blue-600">
                                        github.com/AkuSeorangManusia/
                                    </span>
                                </div>
                            </button>

                            {/* Instagram */}
                            <button
                                type="button"
                                className="flex items-center gap-3 pb-2 hover:cursor-pointer bg-transparent border-0 p-0 text-left"
                                onClick={() =>
                                    window.open(
                                        "https://www.instagram.com/andimsum_",
                                        "_blank",
                                    )
                                }
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src="/instagram-icon.png"
                                    alt="Instagram"
                                    width={32}
                                    height={32}
                                    className="w-8"
                                />
                                <div className="leading-none">
                                    <strong>Instagram</strong>
                                    <br />
                                    <span className="text-blue-600">
                                        instagram.com/andimsum_
                                    </span>
                                </div>
                            </button>

                            {/* Discord */}
                            <button
                                type="button"
                                className="flex items-center gap-3 pb-2 hover:cursor-pointer bg-transparent border-0 p-0 text-left"
                                onClick={handleCopy}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src="/discord-icon.jpg"
                                    alt="Discord"
                                    width={32}
                                    height={32}
                                    className="w-8 rounded"
                                />
                                <div className="leading-none">
                                    <strong>Discord</strong>
                                    <br />
                                    <span className="text-blue-600">
                                        andimsum_
                                    </span>
                                    <br />
                                    {copied && (
                                        <span className="text-green-600">
                                            Copied!
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <Image
                    src="/address-me.jpg"
                    alt="address me"
                    width={128}
                    height={128}
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
        setEquation(`${equation + display} ${op} `);
        setIsNewNumber(true);
    };

    const handleDecimal = () => {
        if (!display.includes(".")) {
            setDisplay(`${display}.`);
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
            const result = evaluateExpression(fullEquation);
            setDisplay(result);
            setEquation(`${fullEquation} =`);
            setIsNewNumber(true);
        } catch (_error) {
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
            type="button"
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
                <Button
                    label="0"
                    onClick={() => handleNumber("0")}
                    span={true}
                />
                <Button label="." onClick={handleDecimal} />
                <Button
                    label="+"
                    onClick={() => handleOperator("+")}
                    className="bg-blue-100 hover:bg-blue-200"
                />

                {/* Row 6: Equals (span 4) */}
                <button
                    type="button"
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

export function Blog({ onOpenArticle }) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch articles via the portfolio's server-side proxy
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("/api/blog/articles");
                if (!response.ok) {
                    throw new Error("Failed to fetch articles");
                }
                const data = await response.json();
                setArticles(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching articles:", err);
                setError("Failed to load articles. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleArticleClick = (slug, title) => {
        if (onOpenArticle) {
            onOpenArticle(slug, title);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <div className="text-xl text-gray-600">
                        Loading articles...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <div className="text-xl text-red-600 mb-2">Error</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto p-4">
            <h2 className="text-3xl text-black font-bold mb-4">Blog</h2>
            <p className="text-gray-600 mb-4 leading-none">
                I write things sometimes. You can view them here or you can
                visit them directly at{" "}
                <a
                    href="https://blog.ahsansanadi.site"
                    className="text-blue-600 underline"
                >
                    blog.ahsansanadi.site
                </a>
            </p>
            <div className="space-y-4">
                {articles.map((article) => (
                    <button
                        type="button"
                        key={article.slug}
                        onClick={() =>
                            handleArticleClick(article.slug, article.title)
                        }
                        className="border-2 border-gray-400 p-4 hover:bg-gray-100 cursor-pointer transition-colors w-full text-left bg-transparent"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-black mb-2">
                            {article.title}
                        </h3>
                        <div className="text-sm text-gray-600 mb-2">
                            {new Date(article.date).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                            {article.author && ` • ${article.author}`}
                        </div>
                        {article.description && (
                            <p className="text-gray-700">
                                {article.description}
                            </p>
                        )}
                        {article.tags && article.tags.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {article.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function BlogArticle({ slug }) {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(
                    `/api/blog/articles/${slug}`,
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch article");
                }
                const data = await response.json();
                setArticle(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching article:", err);
                setError("Failed to load article. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">📖</div>
                    <div className="text-xl text-gray-600">
                        Loading article...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <div className="text-xl text-red-600 mb-2">Error</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <div className="text-xl text-gray-600">
                        Article not found
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-auto p-6">
            {/* Article Header */}
            <div className="mb-6 pb-4 border-b-2 border-gray-300">
                <h1 className="text-4xl font-bold text-black mb-3">
                    {article.title}
                </h1>
                <div className="text-gray-600">
                    <Image
                        src={article.thumbnail}
                        alt={article.title}
                        width={800}
                        height={450}
                        unoptimized
                        className="max-w-full h-auto"
                    />
                    {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                    {article.author && ` • By ${article.author}`}
                </div>
                {article.tags && article.tags.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Article Content */}
            <div className="article-content text-black">
                {parse(article.contentHtml || "")}
            </div>
        </div>
    );
}
