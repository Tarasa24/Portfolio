{ pkgs, lib, config, inputs, ... }:

{
  packages = [ pkgs.git pkgs.hugo ];

  languages.go.enable = true;

  enterShell = ''
  '';
}
