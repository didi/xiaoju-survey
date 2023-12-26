<template>
  <div
    class="login-page"
    :style="{
      background: `url('/imgs/create/background.jpg') no-repeat bottom right`,
      'background-size': 'cover',
    }"
  >
    <div class="login-top">
      <img src="/imgs/Logo.jpg" alt="logo" />
      <span>您好，请登录</span>
    </div>
    <div class="login-box">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="login-form"
        @submit.native.prevent
      >
        <el-form-item label="账号" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-wrapper">
            <el-input
              style="width: 150px"
              v-model="formData.captcha"
            ></el-input>
            <div
              class="captcha-img"
              @click="refreshCaptcha"
              v-html="captchaImgData"
            ></div>
          </div>
        </el-form-item>

        <el-form-item class="button-group">
          <el-button
            :loading="loginPending"
            size="small"
            type="primary"
            class="button"
            @click="submitForm('formData', 'login')"
            >登录</el-button
          >
          <el-button
            :loading="registerPending"
            size="small"
            class="button register-button"
            @click="submitForm('formData', 'register')"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { login, register } from '@/management/api/user';
import { refreshCaptcha } from '@/management/api/captcha';
import { CODE_MAP } from '@/management/api/base';
export default {
  name: 'loginPage',
  data() {
    return {
      formData: {
        name: '',
        password: '',
        captcha: '',
        captchaId: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 8,
            max: 16,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur',
          },
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
          },
        ],
      },
      loginPending: false,
      registerPending: false,
      captchaImgData: '',
    };
  },
  created() {
    this.refreshCaptcha();
  },
  methods: {
    submitForm(formName, type) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const submitTypes = {
              login,
              register,
            };
            this[`${type}Pending`] = true;
            const res = await submitTypes[type]({
              username: this.formData.name,
              password: this.formData.password,
              captcha: this.formData.captcha,
              captchaId: this.formData.captchaId,
            });
            this[`${type}Pending`] = false;
            if (res.code !== CODE_MAP.SUCCESS) {
              this.$message.error(res.errmsg);
              this.refreshCaptcha();
              throw new Error('登录/注册失败' + res.errmsg);
            }
            this.$store.dispatch('user/login', {
              username: res.data.username,
              token: res.data.token,
            });
            let redirect = {
              name: 'survey',
            };
            if (this.$route.query.redirect) {
              redirect = decodeURIComponent(this.$route.query.redirect);
            }
            this.$router.replace(redirect);
          } catch (error) {
            this[`${type}Pending`] = false;
            console.log(error);
          }
          return true;
        } else {
          return false;
        }
      });
    },
    async refreshCaptcha() {
      const res = await refreshCaptcha({ captchaId: this.formData.captchaId });
      if (res.code === 200) {
        const { id, img } = res.data;
        this.formData.captchaId = id;
        this.captchaImgData = img;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-page {
  overflow: hidden;
  height: 100vh;

  .login-top {
    color: #4a4c5b;
    height: 56px;
    background: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 90px;
    }
  }

  .login-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .login-form {
    border-radius: 8px;
    padding: 60px 60px 60px 0;
    background: #fff;
    box-shadow: 4px 0 20px 0 rgba(82, 82, 102, 0.15);
    margin-top: -150px;

    .button-group {
      margin-top: 40px;
    }

    .button {
      width: 160px;
      height: 40px;
      font-size: 14px;
    }

    .register-button {
      border-color: #faa600;
      color: #faa600;
      margin-left: 20px;
    }
  }

  .tips {
    color: #999;
    position: fixed;
    bottom: 15px;
    text-align: center;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .captcha-wrapper {
    display: flex;
    align-items: center;
    .captcha-img {
      height: 40px;
      cursor: pointer;
      ::v-deep > svg {
        max-height: 40px;
      }
    }
  }
}
</style>
