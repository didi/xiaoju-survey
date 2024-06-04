package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.entity.User;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.user.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RequestMapping("/user")
@RestController
public class UserController {
    @Resource
    private UserService userService;

    @RequestMapping("/findAllUser")
    public RpcResult<List<User>> findAllUser() {
        return RpcResult.ok(userService.findAllUser());
    }
}
