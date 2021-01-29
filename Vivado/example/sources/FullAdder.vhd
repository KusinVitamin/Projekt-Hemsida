----------------------------------------------------------------------------------
-- Company: LTU
-- Engineer: Rickard Bemm
-- 
-- Create Date: 29.04.2019 13:35:44
-- Design Name: 
-- Module Name: Part1_tb - Behavioral
-- Project Name: Lab 3a
-- Target Devices: 
-- Tool Versions: 
-- Description:  part 1
-- 
-- Dependencies: 
-- 
-- Revision:
-- Revision 0.01 - File Created
-- Revision 0.02 - Renamed input and output signals
-- Additional Comments:
-- 
----------------------------------------------------------------------------------


library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity FullAdder is
    Port ( A : in STD_LOGIC;
           B : in STD_LOGIC;
           C_in : in STD_LOGIC;
           R : out STD_LOGIC;
           C_out : out STD_LOGIC);
end FullAdder;

architecture Behavioral of FullAdder is

begin

    R <= (A xor B) xor C_in;
    C_out <= (A and B) or (C_in and (A xor B));

end Behavioral;
