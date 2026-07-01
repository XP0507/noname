(function () {
  const USERS_KEY = "novaLabUsers";
  const SESSION_KEY = "novaLabCurrentUser";

  function readUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function readSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (error) {
      return null;
    }
  }

  function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      username: user.username,
      phone: user.phone || "",
      email: user.email || "",
      interest: user.interest || "",
      loginAt: new Date().toISOString()
    }));
  }

  function showMessage(element, text, type) {
    if (!element) {
      return;
    }
    element.textContent = text;
    element.classList.add("is-visible");
    element.classList.toggle("is-error", type === "error");
  }

  function updateNavigation() {
    const session = readSession();
    const navs = document.querySelectorAll(".main-nav");

    navs.forEach((nav) => {
      const loginLink = nav.querySelector('a[href="login.html"]');
      const registerLink = nav.querySelector('a[href="register.html"]');

      if (!session || !loginLink || !registerLink) {
        return;
      }

      loginLink.textContent = "你好，" + session.username;
      loginLink.href = "javascript:void(0)";
      loginLink.classList.add("member-chip");
      loginLink.classList.remove("active");

      registerLink.textContent = "退出登录";
      registerLink.href = "javascript:void(0)";
      registerLink.classList.add("logout-button");
      registerLink.classList.remove("active");
      registerLink.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "index.html";
      });
    });
  }

  function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) {
      return;
    }

    const message = document.getElementById("loginMessage");
    const session = readSession();
    if (session) {
      showMessage(message, "当前已登录：" + session.username + "。可返回首页查看会员状态。");
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }

      const account = form.elements.account.value.trim();
      const password = form.elements.password.value;
      const users = readUsers();
      const user = users.find((item) => {
        return item.username === account || item.phone === account || item.email === account;
      });

      if (user && user.password !== password) {
        showMessage(message, "密码不正确，请重新输入。", "error");
        return;
      }

      const loginUser = user || {
        username: account,
        phone: /^1[3-9][0-9]{9}$/.test(account) ? account : "",
        email: account.includes("@") ? account : "",
        interest: "数码装备"
      };

      saveSession(loginUser);
      showMessage(message, "登录成功，正在进入首页...");
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 650);
    });
  }

  function initRegister() {
    const form = document.getElementById("registerForm");
    if (!form) {
      return;
    }

    const message = document.getElementById("registerMessage");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }

      const user = {
        username: form.elements.username.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        password: form.elements.password.value,
        interest: form.elements.interest.value
      };
      const users = readUsers();
      const duplicate = users.some((item) => {
        return item.username === user.username || item.phone === user.phone || item.email === user.email;
      });

      if (duplicate) {
        showMessage(message, "该用户名、手机号或邮箱已注册，可直接登录。", "error");
        return;
      }

      users.push(user);
      saveUsers(users);
      saveSession(user);
      showMessage(message, "注册成功，已为你自动登录...");
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 750);
    });
  }

  function initForgot() {
    const form = document.getElementById("forgotForm");
    if (!form) {
      return;
    }

    const message = document.getElementById("forgotMessage");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }
      showMessage(message, "验证邮件已发送。静态演示站不会真正发送邮件，请返回登录页继续体验。");
    });
  }

  updateNavigation();
  initLogin();
  initRegister();
  initForgot();
})();
