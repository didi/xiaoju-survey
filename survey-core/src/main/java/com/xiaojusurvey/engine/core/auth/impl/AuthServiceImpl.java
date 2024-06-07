package com.xiaojusurvey.engine.core.auth.impl;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.token.Token;
import com.xiaojusurvey.engine.common.entity.user.Captcha;
import com.xiaojusurvey.engine.common.entity.user.CaptchaVo;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.auth.AuthService;
import com.xiaojusurvey.engine.core.auth.captcha.CaptchaGenerator;
import com.xiaojusurvey.engine.core.auth.domain.UserParam;
import com.xiaojusurvey.engine.core.auth.domain.UserVo;
import com.xiaojusurvey.engine.core.auth.util.AuthUtil;
import com.xiaojusurvey.engine.core.auth.util.JwtTokenUtil;
import com.xiaojusurvey.engine.core.user.UserService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 登录注册相关
 */
@Service("authService")
public class AuthServiceImpl implements AuthService {

    @Resource
    private MongoRepository mongoRepository;

    @Resource(name = "simpleCaptchaGenerator")
    private CaptchaGenerator captchaGenerator;

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Resource
    private UserService userService;


    @Override
    public CaptchaVo captcha() {
        Captcha captcha = captchaGenerator.generateRandomText(4);
        mongoRepository.save(captcha);
        return captchaGenerator.generateRandomSvg(captcha);
    }

    @Override
    public UserVo register(UserParam userParam) {
        checkCaptchaIsCorrect(userParam.getCaptchaId(), userParam.getCaptcha());
        //查询用户名是否存在
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(userParam.getUsername()));
        if (!ObjectUtils.isEmpty(mongoRepository.findOne(query, User.class))) {
            throw new ServiceException(RespErrorCode.USER_EXISTS.getMessage(), RespErrorCode.USER_EXISTS.getCode());
        }
        //保存
        User user = new User();
        user.setUsername(userParam.getUsername());
        user.setPassword(AuthUtil.encryptPassword(userParam.getPassword(), userParam.getUsername()));
        mongoRepository.save(user);
        return createTokenAndDeleteCaptcha(userParam);
    }

    /**
     * 生成token,并删除验证码
     *
     * @param userParam
     * @return
     */
    private UserVo createTokenAndDeleteCaptcha(UserParam userParam) {
        //生成token
        Token token = jwtTokenUtil.generateToken(userParam);
        // 验证过的验证码要删掉，防止被别人保存重复调用
        mongoRepository.deleteById(userParam.getCaptchaId(), Captcha.class);
        UserVo userVo = new UserVo();
        userVo.setToken(token.getToken());
        userVo.setUsername(userParam.getUsername());
        return userVo;
    }

    @Override
    public UserVo login(UserParam userParam) {
        //验证码
        checkCaptchaIsCorrect(userParam.getCaptchaId(), userParam.getCaptcha());
        //用户验证
        userService.loadUserByUsernameAndPassword(userParam.getUsername(), userParam.getPassword());
        //生成token
        return createTokenAndDeleteCaptcha(userParam);
    }


    /**
     * 判断验证码是否正确
     *
     * @param captchaId   验证码id
     * @param captchaText 需要验证的文本
     * @return
     */
    public void checkCaptchaIsCorrect(String captchaId, String captchaText) {
        if (ObjectUtils.isEmpty(captchaId) || ObjectUtils.isEmpty(captchaText)) {
            throw new ServiceException(RespErrorCode.CAPTCHA_INCORRECT.getMessage(), RespErrorCode.CAPTCHA_INCORRECT.getCode());
        }
        Captcha captcha = mongoRepository.findById(captchaId, Captcha.class);
        //非空判断
        if (ObjectUtils.isEmpty(captcha)) {
            throw new ServiceException(RespErrorCode.CAPTCHA_INCORRECT.getMessage(), RespErrorCode.CAPTCHA_INCORRECT.getCode());
        }
        if (!captchaText.equals(captcha.getText())) {
            throw new ServiceException(RespErrorCode.CAPTCHA_INCORRECT.getMessage(), RespErrorCode.CAPTCHA_INCORRECT.getCode());
        }
    }


}
