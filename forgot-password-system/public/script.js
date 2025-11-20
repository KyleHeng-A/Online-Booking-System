if (document.title.includes("Forgot Password")) {

  const btn = document.querySelector(".btn");
  const emailInput = document.getElementById("email");
  const err = document.getElementById("email-error");
  const msg = document.getElementById("email-msg");

  //🔹 输入变化时自动清除错误（满足 description）
  emailInput.addEventListener("input", () => {
    err.textContent = "";
    emailInput.setAttribute("aria-invalid", "false");
  });

  btn.addEventListener("click", () => {

    const email = emailInput.value.trim();
    err.textContent = "";
    msg.textContent = "";

    //---------------------------------------------
    // 必填验证
    //---------------------------------------------
    if (email === "") {
      err.textContent = "Email is required.";
      emailInput.setAttribute("aria-invalid", "true");
      return;
    }

    //---------------------------------------------
    // 格式验证（缺少 @）
    //---------------------------------------------
    if (!email.includes("@")) {
      err.textContent = "Please enter a valid email address.";
      emailInput.setAttribute("aria-invalid", "true");
      return;
    }

    //---------------------------------------------
    // 成功提示（符合 description 模糊提示）
    //---------------------------------------------
    msg.textContent = "If an account exists for that email, a reset link has been sent.";

    //---------------------------------------------
    // 2 秒后跳转到 reset.html（模拟收到邮件）
    //---------------------------------------------
    setTimeout(() => {
      window.location.href = "reset.html";
    }, 2000);
  });
}

//------------------------------------------------------------
//  Reset Password - 完整前端版本
//------------------------------------------------------------
if (document.title.includes("Reset Password")) {

  const btn = document.querySelector(".btn");
  const newPass = document.getElementById("new-password");
  const confPass = document.getElementById("confirm-password");

  const newErr = document.getElementById("newpass-error");
  const confErr = document.getElementById("confpass-error");
  const msg = document.getElementById("rp-msg");

  const toggleEyes = document.querySelectorAll(".toggle-eye");

  //------------------------------------------------------------
  // Show/Hide 功能（点击 👁 切换 password/text）
  //------------------------------------------------------------
  toggleEyes.forEach((eye, index) => {
    eye.style.cursor = "pointer";  // 现在可点击

    eye.addEventListener("click", () => {
      const input = index === 0 ? newPass : confPass;
      if (input.type === "password") {
        input.type = "text";
        eye.textContent = "🙈";
      } else {
        input.type = "password";
        eye.textContent = "👁";
      }
    });
  });


  //------------------------------------------------------------
  // 实时验证新密码（满足 description 的“实时错误自动消失”）
  //------------------------------------------------------------
  newPass.addEventListener("input", () => {
    newErr.textContent = "";
    newPass.setAttribute("aria-invalid", "false");

    if (newPass.value.length < 8) {
      newErr.textContent = "Password must be at least 8 characters.";
      newPass.setAttribute("aria-invalid", "true");
    } else if (!/[!@#$%^&*]/.test(newPass.value)) {
      newErr.textContent = "Password must contain at least one special character.";
      newPass.setAttribute("aria-invalid", "true");
    }
  });

  //------------------------------------------------------------
  // 实时验证 Confirm Password
  //------------------------------------------------------------
  confPass.addEventListener("input", () => {
    confErr.textContent = "";
    confPass.setAttribute("aria-invalid", "false");

    if (confPass.value !== newPass.value) {
      confErr.textContent = "Passwords do not match.";
      confPass.setAttribute("aria-invalid", "true");
    }
  });


  //------------------------------------------------------------
  // 点击按钮时执行最终验证
  //------------------------------------------------------------
  btn.addEventListener("click", () => {

    newErr.textContent = "";
    confErr.textContent = "";
    msg.textContent = "";

    const pass = newPass.value;
    const confirm = confPass.value;

    // 必填验证
    if (!pass || !confirm) {
      newErr.textContent = "Please fill in both fields.";
      return;
    }

    // 密码长度
    if (pass.length < 8) {
      newErr.textContent = "Password must be at least 8 characters.";
      return;
    }

    // 特殊字符验证
    if (!/[!@#$%^&*]/.test(pass)) {
      newErr.textContent = "Password must contain at least one special character.";
      return;
    }

    // 两次密码必须一致
    if (pass !== confirm) {
      confErr.textContent = "Passwords do not match.";
      return;
    }

    //------------------------------------------------------------
    // 成功信息（符合 description）
    //------------------------------------------------------------
    msg.textContent = "Your password has been reset successfully.";

    //------------------------------------------------------------
    // 2 秒后跳转到 success.html
    //------------------------------------------------------------
    setTimeout(() => {
      window.location.href = "success.html";
    }, 2000);
  });
}
