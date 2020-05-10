# TaskList



#Script para criação de tabela:

CREATE TABLE IF NOT EXISTS `mydb`.`task` (
  `id`  VARCHAR(40) NOT NULL,
  `descricao` VARCHAR(100) CHARACTER SET 'armscii8' NOT NULL,
  `concluida` int,
  PRIMARY KEY (`id`))
ENGINE = InnoDB

#Criar Persistence Unit. Data Source: jdbc/Task

TaskList
