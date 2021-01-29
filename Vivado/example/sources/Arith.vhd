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
-- Additional Comments:
-- 
----------------------------------------------------------------------------------


library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity Arith is
    Port ( A : in STD_LOGIC_VECTOR(3 downto 0);
           B : in STD_LOGIC_VECTOR(3 downto 0);
           SUB : in STD_LOGIC;
           R : out STD_LOGIC_VECTOR(3 downto 0);
           V : out STD_LOGIC;
           C : out STD_LOGIC);
end Arith;

architecture Behavioral of Arith is

    component Adder port (
        A : in STD_LOGIC_VECTOR(3 downto 0);
        B : in STD_LOGIC_VECTOR(3 downto 0);
        C_in : in STD_LOGIC;
        R :  out STD_LOGIC_VECTOR(3 downto 0);
        V : out STD_LOGIC;
        C_out :  out STD_LOGIC
    );
    end component;

    signal b_sub : STD_LOGIC_VECTOR(3 downto 0);
begin
    b_sub(0) <= B(0) xor SUB;
    b_sub(1) <= B(1) xor SUB;
    b_sub(2) <= B(2) xor SUB;
    b_sub(3) <= B(3) xor SUB;
    
    Adder_instance: Adder port map (A => A, B => b_sub, C_in => SUB, R => R, V => V, C_out => C);

end Behavioral;
