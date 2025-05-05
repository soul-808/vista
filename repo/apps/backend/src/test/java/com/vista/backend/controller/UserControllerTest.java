// Path: apps/backend/src/test/java/com/vista/backend/UserControllerTest.java

package com.vista.backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  @DisplayName("GET /users returns 200")
  @WithMockUser(roles = "ADMIN")
  void getUsersShouldReturn200() throws Exception {
    mockMvc.perform(get("/users"))
           .andExpect(status().isOk());
  }
}
