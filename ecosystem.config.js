module.exports = {
    apps: [
        {
            name: "andimsum-portfolio",
            script: "npm",
            args: "start",
            cwd: "/opt/jenkins/andimsum-portfolio",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
                NEXT_TELEMETRY_DISABLED: 1,
            },
        },
    ],
};
