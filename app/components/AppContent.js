import { useState } from "react";

export function AboutMe() {
  return (
    <div className="p-2">
      <h2 className="text-3xl text-black font-bold mb-4">About Me</h2>
      <div className="flex mb-4 gap-4">
        <div className="flex-none">
          <img src="/lilith.png" alt="my kisah" className="w-32 h-32" />
        </div>
        <div className="text-black leading-none">
          <p>
            Hello! I'm <strong>Muhammad Ahsan Sanadi</strong>, a rather tech
            enthusiast from Yogyakarta, Indonesia.
          </p>
          <p className="mt-2">
            I don't really have any particular interest in one specific field of
            IT. If it interests me, I will probably try it at 2 AM.
          </p>
        </div>
      </div>
      <div className="flex-none text-black leading-none">
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
          <li>Lilith does exist</li>
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

  const handleCopyDiscord = () => {
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
              <div className="flex items-center gap-3 pb-2">
                <img src="/email-icon-99.png" alt="Email" className="w-8" />
                <div className="leading-none">
                  <strong>Email</strong>
                  <br />
                  <span className="text-blue-600">
                    ahsansanadi167@gmail.com
                  </span>
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
                onClick={handleCopyDiscord}
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
