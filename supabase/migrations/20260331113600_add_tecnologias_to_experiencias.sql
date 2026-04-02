-- Migration: add_tecnologias_to_experiencias
-- Description: Adiciona o campo tecnologias à tabela de experiencias.

ALTER TABLE andreric.experiencias ADD COLUMN tecnologias VARCHAR(255);
