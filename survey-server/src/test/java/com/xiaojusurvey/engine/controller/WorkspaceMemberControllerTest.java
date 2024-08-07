package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.workspace.WorkspaceMemberService;
import com.xiaojusurvey.engine.core.workspace.param.CreateWorkspaceMemberParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberIdVO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
/**
 * @description: WorkspaceMemberController 测试
 * @author: wangchenglong
 * @time: 2024/8/1 17:23
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class WorkspaceMemberControllerTest {
    @InjectMocks
    private WorkspaceMemberController workspaceMemberController;

    @Mock
    private WorkspaceMemberService workspaceMemberService;

    private MockHttpServletRequest mockRequest;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockRequest = new MockHttpServletRequest();
    }

    @Test
    public void testCreateWorkspaceMember() {
        CreateWorkspaceMemberParam mockParam = new CreateWorkspaceMemberParam();
        String memberId = "123456";

        when(workspaceMemberService.create(any(CreateWorkspaceMemberParam.class)))
                .thenReturn(memberId);

        RpcResult<WorkspaceMemberIdVO> result = workspaceMemberController.create(mockParam);

        assertEquals(true, result.getSuccess());
        assertEquals(memberId, result.getData().getMemberId());
    }

    @Test
    public void testUpdateWorkspaceMemberRole() {
        CreateWorkspaceMemberParam mockParam = new CreateWorkspaceMemberParam();

        RpcResult<?> result = workspaceMemberController.updateRole(mockParam);

        assertEquals(true, result.getSuccess());
    }

    @Test
    public void testDeleteWorkspaceMember() {
        CreateWorkspaceMemberParam mockParam = new CreateWorkspaceMemberParam();

        RpcResult<?> result = workspaceMemberController.delete(mockParam);

        assertEquals(true, result.getSuccess());
    }
}
