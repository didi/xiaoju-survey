package com.xiaojusurvey.engine.controller;

import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.exception.FileException;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.auth.util.JwtTokenUtil;
import com.xiaojusurvey.engine.extensions.file.model.FileReq;
import com.xiaojusurvey.engine.extensions.file.model.FileResp;
import com.xiaojusurvey.engine.extensions.file.service.FileService;
import com.xiaojusurvey.engine.oss.FileProperties;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Objects;

import static com.xiaojusurvey.engine.interceptor.LoginInterceptor.USER_ID;
import static com.xiaojusurvey.engine.interceptor.LoginInterceptor.USER_NAME;

@RestController
@RequestMapping("/file")
public class FileController {

    @Resource
    private FileService fileService;

    @Resource
    private FileProperties fileProperties;

    @Resource
    private HttpServletRequest request;

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    /**
     * 上传文件
     *
     * @param fileReq 文件请求
     * @return 文件key和url
     */
    @PostMapping("/upload")
    public RpcResult<FileResp> upload(FileReq fileReq) {
        if (Objects.isNull(fileReq)) {
            throw new FileException("文件上传参数为空", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        // 检查登录状态
        /*if (fileProperties.getNeedAuth()) {
            if (!isLogin()) {
                throw new ServiceException(RespErrorCode.USER_CREDENTIALS_ERROR.getMessage(), RespErrorCode.USER_CREDENTIALS_ERROR.getCode());
            }
        }*/
        return RpcResultUtil.createSuccessResult(fileService.upload(fileReq));
    }

    /**
     * 获取文件访问链接
     *
     * @param channel 存储oss的key
     * @param key     文件唯一标识符
     * @return 文件的访问链接
     */
    @GetMapping("/getUrl")
    public RpcResult<String> getUrl(@RequestParam("channel") String channel, @RequestParam("key") String key) {
        if (!StringUtils.hasText(key)) {
            throw new FileException("文件唯一标识符为空", RespErrorCode.UPLOAD_FILE_ERROR.getCode());
        }
        return RpcResultUtil.createSuccessResult(fileService.getUrl(channel, key));
    }

    /**
     * 从Request中获取token检查用户登录状态
     *
     * @return true-登录有效，false-登录失效
     */
    private Boolean isLogin() {
        //1:获取token jwt
        DecodedJWT jwt = jwtTokenUtil.getTokenStrByRequest(request);
        //2:判断token是否有效 && 是否过期
        if (ObjectUtils.isEmpty(jwt)) {
            //token找不到
            return false;
        }
        if (jwt.getExpiresAt().getTime() < System.currentTimeMillis()) {
            //token超时
            return false;
        }
        //查询用户信息
        Map<String, Claim> claims = jwt.getClaims();
        //获取用户名,密码
        String username = null, userId = null;
        if (!ObjectUtils.isEmpty(claims.get(USER_NAME))) {
            username = claims.get(USER_NAME).asString();
        }
        if (!ObjectUtils.isEmpty(claims.get(USER_ID))) {
            userId = claims.get(USER_ID).asString();
        }
        //判空
        if (ObjectUtils.isEmpty(username) || ObjectUtils.isEmpty(userId)) {
            //token超时
            return false;
        }
        return true;
    }


}