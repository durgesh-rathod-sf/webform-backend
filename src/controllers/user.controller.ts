import { inject } from "@loopback/core";
import { LoggingBindings, WinstonLogger } from "@loopback/logging";
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from "@loopback/repository";
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from "@loopback/rest";
import { authenticate, STRATEGY } from "loopback4-authentication";
import { authorize } from "loopback4-authorization";
import { User } from "../models";
import { UserRepository } from "../repositories";
import { setCreatedOn } from "../Utilities/Decorators";

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(LoggingBindings.WINSTON_LOGGER)
    private logger: WinstonLogger
  ) {}

  // @authenticate(STRATEGY.BEARER)
  // @authorize({ permissions: ["addusers"] })
  @post("/users")
  @response(200, {
    description: "User model instance",
    content: { "application/json": { schema: getModelSchemaRef(User) } },
  })
  @setCreatedOn()
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, {
            title: "NewUser",
            exclude: ["id"],
          }),
        },
      },
    })
    user: Omit<User, "id">
  ): Promise<User> {
    this.logger.log("info", "greeting");

    return this.userRepository.create(user);
  }

  @get("/users/count")
  @response(200, {
    description: "User model count",
    content: { "application/json": { schema: CountSchema } },
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  // @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: ["*"] })
  @get("/users")
  @response(200, {
    description: "Array of User model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    this.logger.log("info", "find users called");
    return this.userRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: ["updateusers"] })
  @patch("/users")
  @response(200, {
    description: "User PATCH success count",
    content: { "application/json": { schema: CountSchema } },
  })
  // @setUpdatedOn()
  async updateAll(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  // @authenticate(STRATEGY.BEARER)
  // @authorize({ permissions: ["getusers"] })
  @get("/users/{id}")
  @response(200, {
    description: "User model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string("id") id: string,
    @param.filter(User, { exclude: "where" })
    filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    this.logger.log("warn", "warning");
    this.logger.log("error", "error warning");
    return this.userRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: ["updateusers"] })
  @patch("/users/{id}")
  @response(204, {
    description: "User PATCH success",
  })
  async updateById(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put("/users/{id}")
  @response(204, {
    description: "User PUT success",
  })
  async replaceById(
    @param.path.string("id") id: string,
    @requestBody() user: User
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({ permissions: ["deleteusers"] })
  @del("/users/{id}")
  @response(204, {
    description: "User DELETE success",
  })
  async deleteById(@param.path.string("id") id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
