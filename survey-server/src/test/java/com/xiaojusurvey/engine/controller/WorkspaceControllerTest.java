package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.workspace.WorkspaceService;
import com.xiaojusurvey.engine.core.workspace.param.WorkspaceParam;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceListVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceMemberVO;
import com.xiaojusurvey.engine.core.workspace.vo.WorkspaceVO;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
/**
 * @description: WorkspaceController测试
 * @author: wangchenglong
 * @time: 2024/8/1 16:52
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class WorkspaceControllerTest {

    @InjectMocks
    private WorkspaceController workspaceController;

    @Mock
    private WorkspaceService workspaceService;

    private MockHttpServletRequest mockRequest;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        mockRequest = new MockHttpServletRequest();
    }

    @Test
    public void testCreateWorkspace() {
        WorkspaceParam mockWorkspaceParam = new WorkspaceParam();
        String workspaceId = "123456";

        when(workspaceService.createWorkspace(any(HttpServletRequest.class), any(WorkspaceParam.class)))
                .thenReturn(workspaceId);

        RpcResult<WorkspaceVO> result = workspaceController.create(mockRequest, mockWorkspaceParam);

        assertEquals(true, result.getSuccess());
        assertEquals(workspaceId, result.getData().getWorkspaceId());
    }

    @Test
    public void testFindAllWorkspaces() {
        int pageSize = 10;
        int curPage = 1;
        String name = "TestWorkspace";
        WorkspaceListVO mockListVO = new WorkspaceListVO();

        when(workspaceService.findAll(any(HttpServletRequest.class), eq(pageSize), eq(curPage), eq(name)))
                .thenReturn(mockListVO);

        RpcResult<WorkspaceListVO> result = workspaceController.findAll(mockRequest, pageSize, curPage, name);

        assertEquals(true, result.getSuccess());
        assertNotNull(result.getData());
    }

    @Test
    public void testGetWorkspaceInfo() {
        String workspaceId = "123456";
        WorkspaceMemberVO mockMemberVO = new WorkspaceMemberVO();

        when(workspaceService.getWorkspaceInfo(any(HttpServletRequest.class), eq(workspaceId)))
                .thenReturn(mockMemberVO);

        RpcResult<WorkspaceMemberVO> result = workspaceController.getWorkspaceInfo(mockRequest, workspaceId);

        assertEquals(true, result.getSuccess());
        assertNotNull(result.getData());
    }

    @Test
    public void testUpdateWorkspace() {
        String workspaceId = "123456";
        WorkspaceParam mockWorkspaceParam = new WorkspaceParam();

        RpcResult<?> result = workspaceController.update(mockRequest, workspaceId, mockWorkspaceParam);

        assertEquals(true, result.getSuccess());
        verify(workspaceService, times(1)).update(any(HttpServletRequest.class), eq(mockWorkspaceParam), eq(workspaceId));
    }

    @Test
    public void testDeleteWorkspace() {
        String workspaceId = "123456";

        RpcResult<?> result = workspaceController.delete(mockRequest, workspaceId);

        assertEquals(true, result.getSuccess());
        verify(workspaceService, times(1)).delete(any(HttpServletRequest.class), eq(workspaceId));
    }

    @Test
    public void testGetWorkspaceAndMemberList() {
        List<WorkspaceMemberVO> mockMemberList = new ArrayList<>();

        when(workspaceService.findAllByUserId(any(HttpServletRequest.class)))
                .thenReturn(mockMemberList);

        RpcResult<List<WorkspaceMemberVO>> result = workspaceController.getWorkspaceAndMember(mockRequest);

        assertEquals(true, result.getSuccess());
        assertEquals(mockMemberList, result.getData());
    }

}
